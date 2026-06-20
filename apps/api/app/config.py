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

    # Monitoring
    sentry_dsn: str = ''


settings = Settings()
