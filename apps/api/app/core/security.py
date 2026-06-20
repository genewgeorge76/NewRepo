from fastapi import Header, HTTPException
from ..config import settings


async def verify_premium_security(
    x_master_key: str = Header(default='', alias='X-Master-Key'),
) -> dict:
    if not x_master_key or x_master_key != settings.jworden_master_key:
        raise HTTPException(status_code=403, detail='Forbidden')
    return {'authenticated': True}
