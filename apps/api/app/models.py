from datetime import datetime, timezone

from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from .database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Lead(Base):
    __tablename__ = 'leads'

    id = Column(String(64), primary_key=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=True)
    phone = Column(String(30), nullable=True)
    address = Column(String(300), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(50), nullable=True)
    service = Column(String(100), nullable=True)
    service_type = Column(String(100), nullable=True)
    urgency = Column(String(30), nullable=True)
    description = Column(Text, nullable=True)
    estimated_value = Column(Float, nullable=True)
    tier = Column(String(10), nullable=True)
    score = Column(Integer, nullable=True)
    score_label = Column(String(10), nullable=True)
    status = Column(String(30), default='new')
    pipeline_stage = Column(String(30), default='new')
    source = Column(String(50), nullable=True)
    contacted_at = Column(DateTime(timezone=True), nullable=True)
    proposal_sent_at = Column(DateTime(timezone=True), nullable=True)
    closed_at = Column(DateTime(timezone=True), nullable=True)
    closed_reason = Column(String(300), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    jobs = relationship('Job', back_populates='lead')
    payment_transactions = relationship('PaymentTransaction', back_populates='lead')


class Job(Base):
    __tablename__ = 'jobs'

    id = Column(String(64), primary_key=True)
    trade = Column(String(100), nullable=False)
    city = Column(String(100), nullable=True)
    quantity = Column(Float, nullable=False)
    bid = Column(Float, nullable=False)
    status = Column(String(30), default='Estimated')
    is_large_job = Column(Boolean, default=False)
    lead_id = Column(String(64), ForeignKey('leads.id'), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    lead = relationship('Lead', back_populates='jobs')


class Crew(Base):
    __tablename__ = 'crew'

    id = Column(String(64), primary_key=True)
    name = Column(String(200), nullable=False)
    role = Column(String(100), nullable=False)
    status = Column(String(30), default='Available')
    phone = Column(String(30), nullable=True)
    license_expiry = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class Equipment(Base):
    __tablename__ = 'equipment'

    id = Column(String(64), primary_key=True)
    name = Column(String(200), nullable=False)
    type = Column(String(100), nullable=False)
    status = Column(String(30), default='Available')
    serial_number = Column(String(100), nullable=True)
    next_service = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class Estimate(Base):
    __tablename__ = 'estimates'

    id = Column(String(64), primary_key=True)
    trade_key = Column(String(50), nullable=False)
    trade_label = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    tonnage = Column(Float, nullable=True)
    material_cost = Column(Float, nullable=False)
    binder_cost = Column(Float, nullable=False)
    final_bid = Column(Float, nullable=False)
    margin = Column(Float, nullable=False)
    location = Column(String(100), nullable=True)
    is_large_job = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class BlogPost(Base):
    __tablename__ = 'blog_posts'
    __table_args__ = (UniqueConstraint('slug', name='uq_blog_posts_slug'),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(200), nullable=False, index=True)
    title = Column(String(300), nullable=False)
    excerpt = Column(Text, nullable=True)
    body = Column(Text, nullable=True)
    meta_description = Column(String(320), nullable=True)
    author = Column(String(120), default='J. Worden & Sons')
    status = Column(String(20), default='draft')
    read_time_minutes = Column(Integer, nullable=True)
    tags = Column(String(500), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class PaymentTransaction(Base):
    __tablename__ = 'payment_transactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    lead_id = Column(String(64), ForeignKey('leads.id'), nullable=False, index=True)
    stripe_checkout_session_id = Column(String(200), nullable=True, index=True)
    stripe_payment_intent_id = Column(String(200), nullable=True)
    amount_cents = Column(Integer, nullable=True)
    status = Column(String(30), default='pending')
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    lead = relationship('Lead', back_populates='payment_transactions')


class LienCalendarEntry(Base):
    __tablename__ = 'lien_calendar_entries'

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_name = Column(String(120), nullable=False)
    project_address = Column(String(300), nullable=False)
    state_code = Column(String(2), nullable=False, index=True)
    project_start_date = Column(DateTime(timezone=True), nullable=True)
    last_furnishing_date = Column(DateTime(timezone=True), nullable=True)
    preliminary_notice_deadline = Column(DateTime(timezone=True), nullable=True)
    lien_filing_deadline = Column(DateTime(timezone=True), nullable=True, index=True)
    foreclosure_deadline = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    reminder_sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class Customer(Base):
    __tablename__ = 'customers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120), nullable=False)
    email = Column(String(254), nullable=True, index=True)
    phone = Column(String(30), nullable=True)
    company = Column(String(200), nullable=True)
    city = Column(String(100), nullable=True)
    state_code = Column(String(2), nullable=True)
    customer_type = Column(String(30), default='residential')
    is_franchise = Column(Boolean, default=False)
    brand = Column(String(100), nullable=True)
    total_jobs = Column(Integer, default=0)
    total_revenue = Column(Float, default=0.0)
    last_job_date = Column(DateTime(timezone=True), nullable=True)
    source = Column(String(60), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    history = relationship('ServiceHistory', back_populates='customer')


class ServiceHistory(Base):
    __tablename__ = 'service_history'

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False, index=True)
    job_date = Column(DateTime(timezone=True), nullable=True)
    service_type = Column(String(60), nullable=True)
    address = Column(String(300), nullable=True)
    state_code = Column(String(2), nullable=True)
    revenue = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    customer = relationship('Customer', back_populates='history')
