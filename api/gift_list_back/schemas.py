import datetime as dt
from typing import List, Optional

from pydantic import BaseModel, validator


class GiftDelete(BaseModel):
    id: int


class GiftSwap(BaseModel):
    newPosition: int
    oldPosition: int


class GiftCreate(BaseModel):
    name: str
    description: Optional[str] = None
    desired_amount: int
    urls: List[str]
    image_url: Optional[str]
    gift_order: int

    @validator('name', pre=True)
    def validate_name(cls, value):
        if not value:
            raise ValueError("empty name not allowed")
        return value


class GiftUpdate(GiftCreate, GiftDelete):
    pass


class Gift(GiftUpdate):
    modified_at: dt.datetime
    claimed: int


class AllergyPut(BaseModel):
    user_email: str
    food_preference: str


class GiftClaim(BaseModel):
    gift_id: int
    amount: int


class GiftClaimUpdate(BaseModel):
    user_email: str
    gift_id: int
    change_in_amount: int


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
