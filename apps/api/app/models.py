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


# ── Wave 2 Models ─────────────────────────────────────────────────────────────

class WorkOrder(Base):
    __tablename__ = 'work_orders'

    id = Column(String(64), primary_key=True)
    job_id = Column(String(64), ForeignKey('jobs.id'), nullable=True, index=True)
    lead_id = Column(String(64), ForeignKey('leads.id'), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(30), default='pending')  # pending, assigned, in_progress, complete
    crew_assigned = Column(String(300), nullable=True)    # comma-separated crew ids
    equipment_assigned = Column(String(300), nullable=True)
    scheduled_date = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    site_address = Column(String(300), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class WorkforceMember(Base):
    __tablename__ = 'workforce_members'

    id = Column(String(64), primary_key=True)
    name = Column(String(200), nullable=False)
    role = Column(String(100), nullable=False)
    email = Column(String(200), nullable=True)
    phone = Column(String(30), nullable=True)
    status = Column(String(30), default='active')  # active, inactive, terminated
    skills = Column(Text, nullable=True)            # JSON array of skill strings
    certifications = Column(Text, nullable=True)    # JSON array of cert objects {name, expiry}
    license_number = Column(String(100), nullable=True)
    license_expiry = Column(DateTime(timezone=True), nullable=True)
    osha_card_expiry = Column(DateTime(timezone=True), nullable=True)
    hire_date = Column(DateTime(timezone=True), nullable=True)
    hourly_rate = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class SubcontractorRoster(Base):
    __tablename__ = 'subcontractor_roster'

    id = Column(String(64), primary_key=True)
    company_name = Column(String(200), nullable=False)
    contact_name = Column(String(200), nullable=True)
    email = Column(String(200), nullable=True)
    phone = Column(String(30), nullable=True)
    trade_specialty = Column(String(200), nullable=True)
    states_licensed = Column(String(300), nullable=True)  # comma-separated state codes
    license_number = Column(String(100), nullable=True)
    license_expiry = Column(DateTime(timezone=True), nullable=True)
    insurance_expiry = Column(DateTime(timezone=True), nullable=True)
    insurance_limit = Column(Float, nullable=True)
    bonded = Column(Boolean, default=False)
    status = Column(String(30), default='active')  # active, inactive, preferred, blacklisted
    rating = Column(Float, nullable=True)          # 1.0–5.0
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    performance_reviews = relationship('SubcontractorPerformance', back_populates='sub')


class SubcontractorPerformance(Base):
    __tablename__ = 'subcontractor_performance'

    id = Column(Integer, primary_key=True, autoincrement=True)
    sub_id = Column(String(64), ForeignKey('subcontractor_roster.id'), nullable=False, index=True)
    job_id = Column(String(64), nullable=True)
    job_date = Column(DateTime(timezone=True), nullable=True)
    quality_score = Column(Integer, nullable=True)     # 1–5
    schedule_score = Column(Integer, nullable=True)    # 1–5
    communication_score = Column(Integer, nullable=True)
    would_rehire = Column(Boolean, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    sub = relationship('SubcontractorRoster', back_populates='performance_reviews')


class SafetyToolboxTalk(Base):
    __tablename__ = 'safety_toolbox_talks'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    topic = Column(String(100), nullable=False)  # fall_protection, struck_by, caught_between, electrical, heat, etc.
    content = Column(Text, nullable=False)
    duration_minutes = Column(Integer, default=10)
    presenter = Column(String(200), nullable=True)
    attendees = Column(Text, nullable=True)  # JSON array of names
    site_address = Column(String(300), nullable=True)
    presented_at = Column(DateTime(timezone=True), nullable=True)
    ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class SafetyIncident(Base):
    __tablename__ = 'safety_incidents'

    id = Column(Integer, primary_key=True, autoincrement=True)
    incident_date = Column(DateTime(timezone=True), nullable=False)
    incident_type = Column(String(50), nullable=False)  # recordable, near_miss, first_aid, property_damage
    description = Column(Text, nullable=False)
    location = Column(String(300), nullable=True)
    injured_person = Column(String(200), nullable=True)
    body_part_affected = Column(String(100), nullable=True)
    days_away = Column(Integer, default=0)
    days_restricted = Column(Integer, default=0)
    root_cause = Column(Text, nullable=True)
    corrective_action = Column(Text, nullable=True)
    osha_recordable = Column(Boolean, default=False)
    reported_to_osha = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class CashFlowEntry(Base):
    __tablename__ = 'cashflow_entries'

    id = Column(Integer, primary_key=True, autoincrement=True)
    week_start = Column(DateTime(timezone=True), nullable=False, index=True)
    category = Column(String(60), nullable=False)   # revenue, materials, labor, equipment, overhead, other
    label = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False)          # positive = inflow, negative = outflow
    is_actual = Column(Boolean, default=False)      # True = actual, False = projected
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class CashFlowAlert(Base):
    __tablename__ = 'cashflow_alerts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    threshold_amount = Column(Float, nullable=False)
    alert_email = Column(String(254), nullable=True)
    is_active = Column(Boolean, default=True)
    triggered_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class VdotBid(Base):
    __tablename__ = 'vdot_bids'

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_number = Column(String(50), nullable=True, index=True)
    project_name = Column(String(400), nullable=False)
    district = Column(String(100), nullable=True)
    county = Column(String(100), nullable=True)
    state_route = Column(String(50), nullable=True)
    bid_date = Column(DateTime(timezone=True), nullable=True, index=True)
    estimated_cost = Column(Float, nullable=True)
    project_type = Column(String(100), nullable=True)  # paving, grading, bridge, etc.
    tier = Column(String(10), nullable=True)            # WHALE, SHARK, FISH
    url = Column(String(500), nullable=True)
    status = Column(String(30), default='open')         # open, bid, awarded, cancelled
    scraped_at = Column(DateTime(timezone=True), default=utcnow)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class GalleryImage(Base):
    __tablename__ = 'gallery_images'

    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(300), nullable=False)
    original_filename = Column(String(300), nullable=True)
    storage_path = Column(String(500), nullable=False)   # local path or S3 key
    storage_type = Column(String(10), default='local')   # local, s3
    url = Column(String(500), nullable=True)
    caption = Column(String(400), nullable=True)
    project_type = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    state_code = Column(String(2), nullable=True)
    is_before = Column(Boolean, nullable=True)           # True=before, False=after, None=standalone
    is_featured = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class ChatSession(Base):
    __tablename__ = 'chat_sessions'

    id = Column(String(64), primary_key=True)
    context = Column(String(200), nullable=True)   # 'jarvis', 'public', etc.
    created_at = Column(DateTime(timezone=True), default=utcnow)
    last_active_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    messages = relationship('ChatMessage', back_populates='session', order_by='ChatMessage.id')


class ChatMessage(Base):
    __tablename__ = 'chat_messages'

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(64), ForeignKey('chat_sessions.id'), nullable=False, index=True)
    role = Column(String(20), nullable=False)    # user, assistant
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    session = relationship('ChatSession', back_populates='messages')


class ProposalOutcome(Base):
    __tablename__ = 'proposal_outcomes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    lead_id = Column(String(64), ForeignKey('leads.id'), nullable=True, index=True)
    proposal_title = Column(String(300), nullable=False)
    proposal_body = Column(Text, nullable=True)
    estimated_value = Column(Float, nullable=True)
    outcome = Column(String(20), nullable=True)   # won, lost, pending, expired
    lost_reason = Column(String(300), nullable=True)
    competitor_won = Column(String(200), nullable=True)
    generated_at = Column(DateTime(timezone=True), default=utcnow)
    decided_at = Column(DateTime(timezone=True), nullable=True)
