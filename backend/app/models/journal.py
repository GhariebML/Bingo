from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class JournalEntryModel(Base):
    __tablename__ = 'journal_entries'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), index=True)
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    mood: Mapped[str | None] = mapped_column(String(80), nullable=True)
    emotion_tags: Mapped[str] = mapped_column(Text, default='')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship('User', back_populates='journals')


class StructuredJournalModel(Base):
    __tablename__ = 'structured_journals'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), index=True)
    situation: Mapped[str] = mapped_column(Text)
    thought: Mapped[str] = mapped_column(Text)
    emotion: Mapped[str] = mapped_column(Text)
    action: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship('User', back_populates='structured_journals')

