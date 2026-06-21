"""Auth — JWT token issuance, master-key exchange, PIN fallback."""
from __future__ import annotations

import hmac
import json
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from jose import jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..config import settings
from ..core.limiter import limiter
from ..database import get_db
from ..models import AuditEvent

router = APIRouter(prefix='/auth', tags=['auth'])

_TOKEN_EXPIRE_HOURS = 24


def _issue_jwt(sub: str, tenant_id: str = 'JWORDEN_HQ') -> str:
    now = datetime.now(timezone.utc)
    payload = {
        'sub': sub,
        'tenant_id': tenant_id,
        'iat': int(now.timestamp()),
        'exp': int((now + timedelta(hours=_TOKEN_EXPIRE_HOURS)).timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_jwt(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])


def _log_audit(db: Session, actor: str, action: str, ip: str | None = None, detail: dict | None = None) -> None:
    try:
        db.add(AuditEvent(actor=actor, action=action, ip_address=ip, detail=json.dumps(detail or {})))
        db.commit()
    except Exception:
        pass


class TokenRequest(BaseModel):
    master_key: str


class PinTokenRequest(BaseModel):
    pin: str


@router.post('/token')
@limiter.limit('10/minute')
async def issue_token(request: Request, body: TokenRequest, db: Session = Depends(get_db)):
    """Exchange master key for a 24-hour JWT."""
    if not hmac.compare_digest(body.master_key.encode(), settings.jworden_master_key.encode()):
        _log_audit(db, 'anonymous', 'auth.token.failed', request.client.host if request.client else None)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid master key')
    token = _issue_jwt('Admin')
    _log_audit(db, 'Admin', 'auth.token.issued', request.client.host if request.client else None)
    return {'access_token': token, 'token_type': 'bearer', 'expires_in': _TOKEN_EXPIRE_HOURS * 3600}


@router.post('/pin-token')
@limiter.limit('5/minute')
async def issue_pin_token(request: Request, body: PinTokenRequest, db: Session = Depends(get_db)):
    """PIN-based auth fallback (4-digit PIN stored in ADMIN_PIN env var)."""
    if not settings.admin_pin or not hmac.compare_digest(body.pin.encode(), settings.admin_pin.encode()):
        _log_audit(db, 'anonymous', 'auth.pin.failed', request.client.host if request.client else None)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid PIN')
    token = _issue_jwt('Admin-PIN')
    _log_audit(db, 'Admin-PIN', 'auth.pin.issued', request.client.host if request.client else None)
    return {'access_token': token, 'token_type': 'bearer', 'expires_in': _TOKEN_EXPIRE_HOURS * 3600}


@router.get('/status')
async def auth_status(request: Request):
    """Check whether auth is configured (for client-side gating)."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return {'authenticated': False, 'reason': 'no_token'}
    token = auth_header.split(' ', 1)[1]
    try:
        payload = decode_jwt(token)
        return {'authenticated': True, 'sub': payload.get('sub'), 'tenant_id': payload.get('tenant_id')}
    except Exception:
        return {'authenticated': False, 'reason': 'invalid_token'}
