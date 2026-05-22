from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserSettings(Base):
    __tablename__ = 'user_settings'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), unique=True, index=True)
    preferred_language: Mapped[str] = mapped_column(String(40), default='English')
    response_style: Mapped[str] = mapped_column(String(40), default='balanced')
    crisis_region: Mapped[str] = mapped_column(String(80), default='United States')
    save_journal_history: Mapped[bool] = mapped_column(default=True)
    save_mood_history: Mapped[bool] = mapped_column(default=True)

    # Dynamic AI provider columns
    ai_provider: Mapped[str] = mapped_column(String(40), default='mock')
    enable_real_ai: Mapped[bool] = mapped_column(default=False)
    openai_api_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
    openai_model: Mapped[str] = mapped_column(String(80), default='gpt-4o-mini')
    openai_base_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    openrouter_api_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
    openrouter_model: Mapped[str] = mapped_column(String(80), default='openai/gpt-4o-mini')
    openrouter_base_url: Mapped[str] = mapped_column(String(255), default='https://openrouter.ai/api/v1')
    hf_token: Mapped[str | None] = mapped_column(String(255), nullable=True)
    hf_model: Mapped[str | None] = mapped_column(String(120), nullable=True)
    hf_base_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    user = relationship('User', back_populates='settings')
