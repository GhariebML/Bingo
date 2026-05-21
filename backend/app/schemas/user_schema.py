from pydantic import BaseModel, Field

class UserProfile(BaseModel):
    id: int | None = None
    email: str = Field(min_length=3, max_length=320)
    display_name: str | None = None
    email_verified: bool = False
    mfa_enabled: bool = False


class AuthRequest(BaseModel):
    email: str = Field(min_length=3, max_length=320)
    password: str = Field(min_length=8, max_length=200)
    display_name: str | None = None
    mfa_code: str | None = None


class AuthResponse(BaseModel):
    token: str
    user: UserProfile


class MessageResponse(BaseModel):
    message: str
    dev_token: str | None = None
    dev_code: str | None = None


class PasswordResetRequest(BaseModel):
    email: str = Field(min_length=3, max_length=320)


class PasswordResetConfirm(BaseModel):
    token: str = Field(min_length=16)
    password: str = Field(min_length=8, max_length=200)


class EmailVerificationConfirm(BaseModel):
    token: str = Field(min_length=16)


class MfaVerifyRequest(BaseModel):
    code: str = Field(min_length=6, max_length=6)
