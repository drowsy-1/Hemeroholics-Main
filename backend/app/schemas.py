from datetime import datetime
from pydantic import BaseModel, EmailStr


# ── Subscribers ──

class SubscribeRequest(BaseModel):
    email: EmailStr


class SubscribeResponse(BaseModel):
    message: str
    email: str


# ── Articles ──

class ArticleCreate(BaseModel):
    title: str
    slug: str
    excerpt: str = ""
    content: str = ""
    tag: str = ""
    read_time: str = ""
    is_published: bool = False


class ArticleOut(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: str
    content: str
    tag: str
    read_time: str
    is_published: bool
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ArticleListOut(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: str
    tag: str
    read_time: str
    published_at: datetime | None

    model_config = {"from_attributes": True}


class ArticlesResponse(BaseModel):
    articles: list[ArticleListOut]
    total: int
    page: int
    per_page: int
