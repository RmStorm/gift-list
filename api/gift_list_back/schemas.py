import datetime as dt
from typing import List, Optional

from pydantic import BaseModel


class GiftCreate(BaseModel):
    name: str
    description: Optional[str] = None
    desired_amount: int
    urls: List[str]
    image_url: Optional[str]


class Gift(GiftCreate):
    id: int
    modified_at: dt.datetime
