from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..config import settings
from ..services.ai_engine import ask_jarvis, score_bid

router = APIRouter(prefix='/ai', tags=['ai'])


class JarvisRequest(BaseModel):
    messages: list[dict]
    field_mode: bool = False


class BidScoreRequest(BaseModel):
    rfp_title: str
    rfp_text: str


@router.post('/jarvis')
async def jarvis_endpoint(body: JarvisRequest):
    if not settings.anthropic_api_key:
        raise HTTPException(503, 'AI not configured — set ANTHROPIC_API_KEY')
    reply = await ask_jarvis(body.messages, body.field_mode)
    return {'reply': reply}


@router.post('/bid-score')
async def bid_score_endpoint(body: BidScoreRequest):
    if not settings.anthropic_api_key:
        raise HTTPException(503, 'AI not configured — set ANTHROPIC_API_KEY')
    result = await score_bid(body.rfp_title, body.rfp_text)
    return result
