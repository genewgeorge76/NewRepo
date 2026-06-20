from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Lead(Base):
    __tablename__ = 'leads'

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str | None] = mapped_column(String(200))
    phone: Mapped[str | None] = mapped_column(String(30))
    address: Mapped[str | None] = mapped_column(String(300))
    city: Mapped[str | None] = mapped_column(String(100))
    state: Mapped[str | None] = mapped_column(String(50))
    service: Mapped[str | None] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(Text)
    estimated_value: Mapped[float | None] = mapped_column(Float)
    tier: Mapped[str | None] = mapped_column(String(10))
    score: Mapped[int | None] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(30), default='new')
    source: Mapped[str | None] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    jobs: Mapped[list['Job']] = relationship('Job', back_populates='lead')


class Job(Base):
    __tablename__ = 'jobs'

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    trade: Mapped[str] = mapped_column(String(100))
    city: Mapped[str | None] = mapped_column(String(100))
    quantity: Mapped[float] = mapped_column(Float)
    bid: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(30), default='Estimated')
    is_large_job: Mapped[bool] = mapped_column(Boolean, default=False)
    lead_id: Mapped[str | None] = mapped_column(String(64), ForeignKey('leads.id'))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    lead: Mapped['Lead | None'] = relationship('Lead', back_populates='jobs')


class Crew(Base):
    __tablename__ = 'crew'

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(30), default='Available')
    phone: Mapped[str | None] = mapped_column(String(30))
    license_expiry: Mapped[str | None] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Equipment(Base):
    __tablename__ = 'equipment'

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    type: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(30), default='Available')
    serial_number: Mapped[str | None] = mapped_column(String(100))
    next_service: Mapped[str | None] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Estimate(Base):
    __tablename__ = 'estimates'

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    trade_key: Mapped[str] = mapped_column(String(50))
    trade_label: Mapped[str] = mapped_column(String(100))
    quantity: Mapped[float] = mapped_column(Float)
    tonnage: Mapped[float | None] = mapped_column(Float)
    material_cost: Mapped[float] = mapped_column(Float)
    binder_cost: Mapped[float] = mapped_column(Float)
    final_bid: Mapped[float] = mapped_column(Float)
    margin: Mapped[float] = mapped_column(Float)
    location: Mapped[str | None] = mapped_column(String(100))
    is_large_job: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
