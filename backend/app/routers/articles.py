import os
from datetime import datetime, timezone

import bleach
from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Article
from app.schemas import ArticleCreate, ArticleListOut, ArticleOut, ArticlesResponse

router = APIRouter(prefix="/api", tags=["articles"])

# Safe HTML tags/attributes for blog content
ALLOWED_TAGS = [
    "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "a", "img", "blockquote", "pre", "code", "hr",
    "table", "thead", "tbody", "tr", "th", "td", "span", "div",
]
ALLOWED_ATTRS = {
    "a": ["href", "title", "target", "rel"],
    "img": ["src", "alt", "width", "height"],
    "span": ["class"],
    "div": ["class"],
    "code": ["class"],
    "pre": ["class"],
}


def sanitize_html(content: str) -> str:
    return bleach.clean(
        content,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRS,
        strip=True,
    )


def require_api_key(x_api_key: str = Header(...)):
    expected = os.getenv("API_KEY", "")
    if not expected:
        raise HTTPException(status_code=503, detail="API key not configured on server")
    if x_api_key != expected:
        raise HTTPException(status_code=403, detail="Invalid API key")


@router.get("/articles", response_model=ArticlesResponse)
async def list_articles(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    offset = (page - 1) * per_page

    count_result = await db.execute(
        select(func.count(Article.id)).where(Article.is_published.is_(True))
    )
    total = count_result.scalar_one()

    result = await db.execute(
        select(Article)
        .where(Article.is_published.is_(True))
        .order_by(Article.published_at.desc())
        .offset(offset)
        .limit(per_page)
    )
    articles = result.scalars().all()

    return ArticlesResponse(
        articles=[ArticleListOut.model_validate(a) for a in articles],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/articles/{slug}", response_model=ArticleOut)
async def get_article(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Article).where(Article.slug == slug, Article.is_published.is_(True))
    )
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return ArticleOut.model_validate(article)


@router.post(
    "/articles",
    response_model=ArticleOut,
    status_code=201,
    dependencies=[Depends(require_api_key)],
)
async def create_article(body: ArticleCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(
        select(Article).where(Article.slug == body.slug)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Slug already exists")

    article = Article(
        title=bleach.clean(body.title, tags=[], strip=True),
        slug=bleach.clean(body.slug, tags=[], strip=True),
        excerpt=bleach.clean(body.excerpt, tags=[], strip=True),
        content=sanitize_html(body.content),
        tag=bleach.clean(body.tag, tags=[], strip=True),
        read_time=bleach.clean(body.read_time, tags=[], strip=True),
        is_published=body.is_published,
        published_at=datetime.now(timezone.utc) if body.is_published else None,
    )
    db.add(article)
    await db.commit()
    await db.refresh(article)
    return ArticleOut.model_validate(article)
