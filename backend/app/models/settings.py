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

    user = relationship('User', back_populates='settings')
