from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    display_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    mfa_code_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    mfa_code_expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    email_verification_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    email_verification_expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    password_reset_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    password_reset_expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    journals = relationship('JournalEntryModel', back_populates='user', cascade='all, delete-orphan')
    moods = relationship('MoodEntryModel', back_populates='user', cascade='all, delete-orphan')
    settings = relationship('UserSettings', back_populates='user', cascade='all, delete-orphan', uselist=False)
    structured_journals = relationship('StructuredJournalModel', back_populates='user', cascade='all, delete-orphan')
    breathing_sessions = relationship('BreathingSessionModel', back_populates='user', cascade='all, delete-orphan')

