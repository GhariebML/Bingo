from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.core.security import (
    create_access_token,
    create_mfa_code,
    hash_password,
    issue_one_time_token,
    verify_mfa_code,
    verify_one_time_token,
    verify_password,
)
from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.audit import AuditEvent
from app.models.settings import UserSettings
from app.models.user import User
from app.schemas.user_schema import (
    AuthRequest,
    AuthResponse,
    EmailVerificationConfirm,
    MessageResponse,
    MfaVerifyRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    UserProfile,
)

router = APIRouter()


def _profile(user: User) -> UserProfile:
    return UserProfile(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        email_verified=user.email_verified,
        mfa_enabled=user.mfa_enabled,
    )


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=token,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite='lax',
        max_age=settings.access_token_ttl_seconds,
        path='/',
    )


def _auth_response(response: Response, user: User) -> AuthResponse:
    token = create_access_token(user.id, user.email)
    _set_session_cookie(response, token)
    return AuthResponse(token=token, user=_profile(user))


def _audit(db: Session, event_type: str, user: User | None = None, detail: str = '') -> None:
    db.add(AuditEvent(user_id=user.id if user else None, event_type=event_type, detail=detail))


@router.post('/register', response_model=AuthResponse)
def register(payload: AuthRequest, response: Response, db: Session = Depends(get_db)) -> AuthResponse:
    email = str(payload.email).lower()
    existing = db.scalar(select(User).where(User.email == email, User.deleted_at.is_(None)))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Email already registered')
    user = User(
        email=email,
        display_name=payload.display_name,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.flush()
    db.add(UserSettings(user_id=user.id))
    _audit(db, 'auth.register', user)
    db.commit()
    db.refresh(user)
    return _auth_response(response, user)


@router.post('/login', response_model=AuthResponse)
def login(payload: AuthRequest, response: Response, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.scalar(select(User).where(User.email == str(payload.email).lower(), User.deleted_at.is_(None)))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid email or password')
    if user.mfa_enabled and not verify_mfa_code(payload.mfa_code, user.mfa_code_hash, user.mfa_code_expires_at):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Valid MFA code required')
    _audit(db, 'auth.login', user)
    db.commit()
    return _auth_response(response, user)


@router.get('/me', response_model=UserProfile)
def me(user: User = Depends(get_current_user)) -> UserProfile:
    return _profile(user)


@router.post('/mock-login', response_model=AuthResponse)
def mock_login(response: Response, db: Session = Depends(get_db)) -> AuthResponse:
    email = 'demo@bingo.local'
    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        user = User(email=email, display_name='Demo User', password_hash=hash_password('demo-password'))
        db.add(user)
        db.flush()
        db.add(UserSettings(user_id=user.id))
        db.commit()
        db.refresh(user)
    _audit(db, 'auth.demo_login', user)
    db.commit()
    return _auth_response(response, user)


@router.post('/logout', response_model=MessageResponse)
def logout(response: Response) -> MessageResponse:
    response.delete_cookie(settings.auth_cookie_name, path='/')
    return MessageResponse(message='Logged out.')


@router.post('/password-reset/request', response_model=MessageResponse)
def request_password_reset(payload: PasswordResetRequest, db: Session = Depends(get_db)) -> MessageResponse:
    user = db.scalar(select(User).where(User.email == str(payload.email).lower(), User.deleted_at.is_(None)))
    dev_token = None
    if user is not None:
        token, token_hash, expires_at = issue_one_time_token()
        user.password_reset_hash = token_hash
        user.password_reset_expires_at = expires_at
        dev_token = token if settings.environment == 'local' else None
        _audit(db, 'auth.password_reset_requested', user)
        db.commit()
    return MessageResponse(message='If the account exists, password reset instructions were prepared.', dev_token=dev_token)


@router.post('/password-reset/confirm', response_model=MessageResponse)
def confirm_password_reset(payload: PasswordResetConfirm, db: Session = Depends(get_db)) -> MessageResponse:
    users = db.scalars(select(User).where(User.deleted_at.is_(None))).all()
    for user in users:
        if verify_one_time_token(payload.token, user.password_reset_hash, user.password_reset_expires_at):
            user.password_hash = hash_password(payload.password)
            user.password_reset_hash = None
            user.password_reset_expires_at = None
            _audit(db, 'auth.password_reset_confirmed', user)
            db.commit()
            return MessageResponse(message='Password reset complete.')
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid or expired reset token')


@router.post('/email-verification/request', response_model=MessageResponse)
def request_email_verification(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> MessageResponse:
    token, token_hash, expires_at = issue_one_time_token()
    user.email_verification_hash = token_hash
    user.email_verification_expires_at = expires_at
    _audit(db, 'auth.email_verification_requested', user)
    db.commit()
    return MessageResponse(
        message='Email verification instructions were prepared.',
        dev_token=token if settings.environment == 'local' else None,
    )


@router.post('/email-verification/confirm', response_model=MessageResponse)
def confirm_email_verification(payload: EmailVerificationConfirm, db: Session = Depends(get_db)) -> MessageResponse:
    users = db.scalars(select(User).where(User.deleted_at.is_(None))).all()
    for user in users:
        if verify_one_time_token(payload.token, user.email_verification_hash, user.email_verification_expires_at):
            user.email_verified = True
            user.email_verification_hash = None
            user.email_verification_expires_at = None
            _audit(db, 'auth.email_verified', user)
            db.commit()
            return MessageResponse(message='Email verified.')
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid or expired verification token')


@router.post('/mfa/setup', response_model=MessageResponse)
def setup_mfa(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> MessageResponse:
    code, code_hash, expires_at = create_mfa_code()
    user.mfa_code_hash = code_hash
    user.mfa_code_expires_at = expires_at
    _audit(db, 'auth.mfa_setup_requested', user)
    db.commit()
    return MessageResponse(message='MFA setup code prepared.', dev_code=code if settings.environment == 'local' else None)


@router.post('/mfa/verify', response_model=MessageResponse)
def verify_mfa(payload: MfaVerifyRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> MessageResponse:
    if not verify_mfa_code(payload.code, user.mfa_code_hash, user.mfa_code_expires_at):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid or expired MFA code')
    user.mfa_enabled = True
    _audit(db, 'auth.mfa_enabled', user)
    db.commit()
    return MessageResponse(message='MFA enabled.')
