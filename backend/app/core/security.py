def placeholder() -> None:
    return None
import base64
import hashlib
import hmac
import json
import secrets
import time
from datetime import datetime, timedelta, timezone

from app.config import settings


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 120_000).hex()
    return f'pbkdf2_sha256${salt}${digest}'


def verify_password(password: str, password_hash: str) -> bool:
    try:
        _, salt, digest = password_hash.split('$', 2)
    except ValueError:
        return False
    candidate = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 120_000).hex()
    return hmac.compare_digest(candidate, digest)


def _hash_value(value: str) -> str:
    return hmac.new(settings.token_secret.encode(), value.encode(), hashlib.sha256).hexdigest()


def create_access_token(user_id: int, email: str, ttl_seconds: int | None = None) -> str:
    now = int(time.time())
    ttl = ttl_seconds or settings.access_token_ttl_seconds
    payload = {'sub': user_id, 'email': email, 'iat': now, 'exp': now + ttl, 'nonce': secrets.token_hex(8)}
    body = base64.urlsafe_b64encode(json.dumps(payload, separators=(',', ':')).encode()).decode().rstrip('=')
    signature = hmac.new(settings.token_secret.encode(), body.encode(), hashlib.sha256).hexdigest()
    return f'{body}.{signature}'


def decode_access_token(token: str) -> dict[str, object] | None:
    try:
        body, signature = token.split('.', 1)
    except ValueError:
        return None
    expected = hmac.new(settings.token_secret.encode(), body.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        return None
    padded = body + '=' * (-len(body) % 4)
    payload = json.loads(base64.urlsafe_b64decode(padded.encode()).decode())
    if int(payload.get('exp', 0)) < int(time.time()):
        return None
    return payload


def issue_one_time_token() -> tuple[str, str, datetime]:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    return token, _hash_value(token), expires_at


def verify_one_time_token(token: str, token_hash: str | None, expires_at: datetime | None) -> bool:
    if not token_hash or not expires_at:
        return False
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return False
    return hmac.compare_digest(_hash_value(token), token_hash)


def create_mfa_code() -> tuple[str, str, datetime]:
    code = f'{secrets.randbelow(1_000_000):06d}'
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    return code, _hash_value(code), expires_at


def verify_mfa_code(code: str | None, code_hash: str | None, expires_at: datetime | None) -> bool:
    if not code:
        return False
    return verify_one_time_token(code, code_hash, expires_at)
