from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    # Core
    environment: str = 'development'
    debug: bool = False
    jworden_master_key: str = 'change-me'
    jwt_secret_key: str = 'change-me-jwt'
    jwt_algorithm: str = 'HS256'

    # Database
    database_url: str = 'sqlite:///./dev.db'

    # Redis / Celery
    redis_url: str = 'redis://localhost:6379/0'

    # Claude
    anthropic_api_key: str = ''

    # OpenAI (vision inspector, blog draft, voice transcription)
    openai_api_key: str = ''

    # Stripe
    stripe_secret_key: str = ''
    stripe_webhook_secret: str = ''

    # Notifications
    sendgrid_api_key: str = ''
    sendgrid_from_email: str = 'no-reply@jwordenasphaltpaving.com'
    twilio_account_sid: str = ''
    twilio_auth_token: str = ''
    twilio_from_number: str = ''

    # Gallery / file storage
    gallery_storage_path: str = './gallery_uploads'
    s3_bucket: str = ''
    s3_region: str = 'us-east-1'
    aws_access_key_id: str = ''
    aws_secret_access_key: str = ''

    # VDOT scraper
    vdot_bids_url: str = 'https://www.vdot.virginia.gov/business/construction-division/advertisement/'

    # Vector search / RAG
    pinecone_api_key: str = ''
    pinecone_index_name: str = 'worden-knowledge'
    pinecone_environment: str = 'us-east-1-aws'

    # Google (GBP, Gemini)
    gemini_api_key: str = ''
    gbp_oauth_token: str = ''
    gbp_location_id: str = ''          # accounts/{acc}/locations/{loc}

    # Admin 2FA
    admin_username: str = 'admin'
    admin_pin: str = ''                 # 4-digit PIN fallback
    totp_issuer: str = 'WordenStandard'

    # Celery
    celery_always_eager: bool = False   # set True in dev to run tasks synchronously

    # Permit scraper
    vpt_api_url: str = 'https://permits.virginiapermit.org/api'

    # Wave 4 — Property Scan → Direct Mail
    regrid_api_key: str = ''          # Regrid parcel data; empty = mock mode
    google_maps_api_key: str = ''     # Google Maps Static API (aerial imagery); empty = mock
    lob_api_key: str = ''             # Lob direct mail; empty = mock send
    lob_from_name: str = 'J. Worden & Sons'   # Business name for Lob "from" address

    # Monitoring
    sentry_dsn: str = ''


settings = Settings()
