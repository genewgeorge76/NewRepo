"""
lien_calendar.py — Mechanics lien deadline calculator.

State-specific lien law data for 13 states. Provides calculate_deadlines()
and get_upcoming_deadlines() for the lien calendar router.
"""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

logger = logging.getLogger(__name__)

_LIEN_LAWS: dict[str, dict] = {
    'VA': {
        'preliminary_notice_days': None,
        'lien_filing_days': 90,
        'foreclosure_days': 180,
        'notes': 'File lien within 90 days of last furnishing. No preliminary notice required.',
    },
    'TX': {
        'preliminary_notice_days': 15,
        'lien_filing_days': 15,
        'foreclosure_days': 180,
        'notes': 'Monthly notices required. File lien by 15th of 3rd month after last furnishing.',
    },
    'FL': {
        'preliminary_notice_days': 45,
        'lien_filing_days': 90,
        'foreclosure_days': 365,
        'notes': 'Notice to Owner required within 45 days of first furnishing.',
    },
    'NC': {
        'preliminary_notice_days': None,
        'lien_filing_days': 120,
        'foreclosure_days': 180,
        'notes': 'File lien within 120 days of last furnishing.',
    },
    'GA': {
        'preliminary_notice_days': None,
        'lien_filing_days': 90,
        'foreclosure_days': 365,
        'notes': 'File lien within 90 days of last furnishing.',
    },
    'NY': {
        'preliminary_notice_days': None,
        'lien_filing_days': 240,
        'foreclosure_days': 365,
        'notes': 'File lien within 8 months of last furnishing (public improvement: 30 days).',
    },
    'NJ': {
        'preliminary_notice_days': None,
        'lien_filing_days': 90,
        'foreclosure_days': 365,
        'notes': 'File lien within 90 days of last furnishing.',
    },
    'MI': {
        'preliminary_notice_days': 20,
        'lien_filing_days': 90,
        'foreclosure_days': 365,
        'notes': 'Notice of commencement required. File lien within 90 days.',
    },
    'CA': {
        'preliminary_notice_days': 20,
        'lien_filing_days': 90,
        'foreclosure_days': 90,
        'notes': 'Preliminary notice required within 20 days. File lien within 90 days.',
    },
    'MD': {
        'preliminary_notice_days': None,
        'lien_filing_days': 180,
        'foreclosure_days': 365,
        'notes': 'File lien within 180 days of last furnishing.',
    },
    'OH': {
        'preliminary_notice_days': None,
        'lien_filing_days': 75,
        'foreclosure_days': 365,
        'notes': 'File lien within 75 days of last furnishing.',
    },
    'PA': {
        'preliminary_notice_days': None,
        'lien_filing_days': 180,
        'foreclosure_days': 365,
        'notes': 'File lien within 6 months of last furnishing.',
    },
    'IL': {
        'preliminary_notice_days': None,
        'lien_filing_days': 120,
        'foreclosure_days': 730,
        'notes': 'File lien within 4 months of last furnishing.',
    },
}

_DEFAULT_LAW = {
    'preliminary_notice_days': None,
    'lien_filing_days': 90,
    'foreclosure_days': 180,
    'notes': 'Default rules applied — verify with a licensed attorney in your state.',
}

SUPPORTED_STATES = sorted(_LIEN_LAWS.keys())


def calculate_deadlines(
    state_code: str,
    project_start_date: datetime,
    last_furnishing_date: datetime,
) -> dict:
    """
    Calculate lien filing deadlines for a project.

    Returns a dict with all deadline dates, days-until counts, and disclaimers.
    """
    law = _LIEN_LAWS.get(state_code.upper(), _DEFAULT_LAW)
    used_default = state_code.upper() not in _LIEN_LAWS

    prelim_deadline: Optional[datetime] = None
    if law['preliminary_notice_days'] is not None:
        prelim_deadline = project_start_date + timedelta(days=law['preliminary_notice_days'])

    lien_deadline = last_furnishing_date + timedelta(days=law['lien_filing_days'])
    foreclosure_deadline = lien_deadline + timedelta(days=law['foreclosure_days'])

    now = datetime.now(timezone.utc)
    days_to_lien = (lien_deadline - now).days
    days_to_foreclose = (foreclosure_deadline - now).days

    return {
        'state_code': state_code.upper(),
        'preliminary_notice_deadline': prelim_deadline.isoformat() if prelim_deadline else None,
        'lien_filing_deadline': lien_deadline.isoformat(),
        'foreclosure_deadline': foreclosure_deadline.isoformat(),
        'days_until_lien_deadline': days_to_lien,
        'days_until_foreclosure_deadline': days_to_foreclose,
        'state_notes': law['notes'],
        'used_default_rules': used_default,
        'disclaimer': 'Verify all deadlines with a licensed attorney — laws change.',
    }


def get_upcoming_deadlines(db, days_ahead: int = 30) -> list[dict]:
    """Return LienCalendarEntry records with deadlines within days_ahead."""
    try:
        from ..models import LienCalendarEntry  # noqa: PLC0415

        now = datetime.now(timezone.utc)
        cutoff = now + timedelta(days=days_ahead)

        entries = (
            db.query(LienCalendarEntry)
            .filter(
                (LienCalendarEntry.lien_filing_deadline <= cutoff)
                | (LienCalendarEntry.preliminary_notice_deadline <= cutoff)
            )
            .order_by(LienCalendarEntry.lien_filing_deadline.asc())
            .all()
        )

        results = []
        for e in entries:
            lien_days = (e.lien_filing_deadline - now).days if e.lien_filing_deadline else None
            prelim_days = (
                (e.preliminary_notice_deadline - now).days
                if e.preliminary_notice_deadline
                else None
            )
            results.append({
                'id': e.id,
                'customer_name': e.customer_name,
                'project_address': e.project_address,
                'state_code': e.state_code,
                'lien_filing_deadline': e.lien_filing_deadline.isoformat() if e.lien_filing_deadline else None,
                'preliminary_notice_deadline': (
                    e.preliminary_notice_deadline.isoformat() if e.preliminary_notice_deadline else None
                ),
                'foreclosure_deadline': e.foreclosure_deadline.isoformat() if e.foreclosure_deadline else None,
                'days_until_lien': lien_days,
                'days_until_prelim': prelim_days,
                'notes': e.notes,
                'is_urgent': (lien_days is not None and lien_days <= 7)
                or (prelim_days is not None and prelim_days <= 7),
            })

        return results
    except Exception as exc:
        logger.error('get_upcoming_deadlines error: %s', exc)
        return []
