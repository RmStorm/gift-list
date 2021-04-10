import datetime as dt
from typing import List, Optional

from pydantic import BaseModel, validator


class GiftCreate(BaseModel):
    name: str
    description: Optional[str] = None
    desired_amount: int
    urls: List[str]
    image_url: Optional[str]

    @validator('name', pre=True)
    def validate_name(cls, value):
        if not value:
            raise ValueError("empty name not allowed")
        return value


class GiftUpdate(GiftCreate):
    id: int


class Gift(GiftUpdate):
    modified_at: dt.datetime


class GoogleToken(BaseModel):
    iss: str
    azp: str
    aud: str
    sub: str
    email: str
    email_verified: bool
    at_hash: str
    name: str
    picture: str
    given_name: str
    family_name: str
    locale: str
    iat: str
    exp: str
    jti: str
    alg: str
    kid: str
    typ: str
