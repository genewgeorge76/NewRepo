from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import health, leads, ai, analytics


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


if settings.sentry_dsn:
    sentry_sdk.init(dsn=settings.sentry_dsn, environment=settings.environment, traces_sample_rate=0.1)

app = FastAPI(
    title='J. Worden & Sons API',
    description='Platform API for jwordenasphaltpaving.com',
    version='1.0.0',
    lifespan=lifespan,
    docs_url='/docs' if settings.debug else None,
    redoc_url=None,
)

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

app.include_router(health.router)
app.include_router(leads.router, prefix='/api/v1')
app.include_router(ai.router, prefix='/api/v1')
app.include_router(analytics.router, prefix='/api/v1')
