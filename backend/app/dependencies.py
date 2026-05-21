from fastapi import Cookie, Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User


def get_current_user(
    authorization: str | None = Header(default=None),
    bingo_session: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User:
    if authorization and authorization.lower().startswith('bearer '):
        token = authorization.split(' ', 1)[1]
    elif bingo_session:
        token = bingo_session
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication required')
    payload = decode_access_token(token)
    if not payload or 'sub' not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token')
    user = db.scalar(select(User).where(User.id == int(payload['sub']), User.deleted_at.is_(None)))
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return user


def get_optional_user(
    authorization: str | None = Header(default=None),
    bingo_session: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User | None:
    if not authorization and not bingo_session:
        return None
    return get_current_user(authorization, bingo_session, db)
