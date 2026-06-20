import anthropic

from ..config import settings

JARVIS_SYSTEM = """You are Jarvis — the AI field commander for J. Worden & Sons Paving & General Contracting, \
a 4th-generation family business (est. 1984) based in Chester, VA.

WORDEN ENGINEERING STANDARDS (non-negotiable):
- 96% Marshall compaction floor (AASHTO T99/T180)
- VDOT Section 315 structural stone base
- Oil shield buffer: ±$9/ton
- Sovereign depth: 6 inches minimum base
- Gross margin floor: 35%
- Binder index: $627.50
- Machine health: $0.08/ton

TONNAGE FORMULA: tons = (sqft / 9 × depth_in × density_pcf) / 24000
- Residential density: 145 pcf | Commercial: 148 pcf

BID TIERS:
- 🐋 Whale: federal/DOT/VDOT/airport — $500K+
- 🦈 Shark: commercial/parking lots/municipalities — $50K–$500K
- 🐟 Fish: residential driveways/patches — <$50K

You speak like a seasoned field foreman: direct, confident, numbers-first. \
When asked to estimate, always show: tonnage → material cost → binder → final bid at 35% margin."""

DEFAULT_MODEL = 'claude-sonnet-4-6'
FAST_MODEL = 'claude-haiku-4-5-20251001'


async def ask_jarvis(messages: list[dict], field_mode: bool = False) -> str:
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    model = FAST_MODEL if field_mode else DEFAULT_MODEL
    response = client.messages.create(
        model=model,
        max_tokens=1024,
        system=JARVIS_SYSTEM,
        messages=messages[-20:],
    )
    return response.content[0].text if response.content else ''


async def score_bid(rfp_title: str, rfp_text: str) -> dict:
    WHALE_SIGNALS = ['federal', 'usace', 'highway', 'state dot', 'vdot', 'airport', 'government', 'dept of']
    SHARK_SIGNALS = ['commercial', 'parking lot', 'shopping center', 'municipality', 'county', 'school']

    text = (rfp_title + ' ' + rfp_text).lower()
    whale_hits = [s for s in WHALE_SIGNALS if s in text]
    shark_hits = [s for s in SHARK_SIGNALS if s in text]

    # Extract dollar amounts
    import re
    amounts = [float(m.replace(',', '')) for m in re.findall(r'\$?([\d,]+(?:\.\d+)?)', rfp_text)]
    max_amount = max(amounts, default=0)

    if whale_hits or max_amount >= 500_000:
        tier, icon = 'whale', '🐋'
    elif shark_hits or max_amount >= 50_000:
        tier, icon = 'shark', '🦈'
    else:
        tier, icon = 'fish', '🐟'

    return {
        'tier': tier,
        'icon': icon,
        'estimated_value': max_amount,
        'confidence': min(95, 60 + len(whale_hits + shark_hits) * 10),
        'signals': whale_hits + shark_hits,
    }
