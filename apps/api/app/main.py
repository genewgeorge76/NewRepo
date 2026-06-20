from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .config import settings
from .core.limiter import limiter
from .database import Base, engine
from .routers import (
    health, leads, ai, analytics, blog, payments, voice,
    lien_calendar, customers, crm,
    # Wave 2
    proposals, operations, dispatch, foreman, workforce, subcontractors,
    safety, cashflow, kpi, vdot_bids, market_intelligence, gallery,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


if settings.sentry_dsn:
    sentry_sdk.init(dsn=settings.sentry_dsn, environment=settings.environment, traces_sample_rate=0.1)

app = FastAPI(
    title='J. Worden & Sons API',
    description='Platform API for jwordenasphaltpaving.com',
    version='2.0.0',
    lifespan=lifespan,
    docs_url='/docs' if settings.debug else None,
    redoc_url=None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'https://www.jwordenasphaltpaving.com',
        'https://jwordenasphaltpaving.com',
        'http://localhost:5173',
        'http://localhost:5174',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Core
app.include_router(health.router)
app.include_router(leads.router, prefix='/api/v1')
app.include_router(ai.router, prefix='/api/v1')
app.include_router(analytics.router, prefix='/api/v1')

# Wave 1
app.include_router(blog.router, prefix='/api/v1')
app.include_router(payments.router, prefix='/api/v1')
app.include_router(voice.router, prefix='/api/v1')
app.include_router(lien_calendar.router, prefix='/api/v1')
app.include_router(customers.router, prefix='/api/v1')
app.include_router(crm.router, prefix='/api/v1')

# Wave 2
app.include_router(proposals.router, prefix='/api/v1')
app.include_router(operations.router, prefix='/api/v1')
app.include_router(dispatch.router, prefix='/api/v1')
app.include_router(foreman.router, prefix='/api/v1')
app.include_router(workforce.router, prefix='/api/v1')
app.include_router(subcontractors.router, prefix='/api/v1')
app.include_router(safety.router, prefix='/api/v1')
app.include_router(cashflow.router, prefix='/api/v1')
app.include_router(kpi.router, prefix='/api/v1')
app.include_router(vdot_bids.router, prefix='/api/v1')
app.include_router(market_intelligence.router, prefix='/api/v1')
app.include_router(gallery.router, prefix='/api/v1')
