from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Article
from app.schemas import ArticleCreate, ArticleListOut, ArticleOut, ArticlesResponse

router = APIRouter(prefix="/api", tags=["articles"])


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


@router.post("/articles", response_model=ArticleOut, status_code=201)
async def create_article(body: ArticleCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(
        select(Article).where(Article.slug == body.slug)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Slug already exists")

    article = Article(
        title=body.title,
        slug=body.slug,
        excerpt=body.excerpt,
        content=body.content,
        tag=body.tag,
        read_time=body.read_time,
        is_published=body.is_published,
        published_at=datetime.now(timezone.utc) if body.is_published else None,
    )
    db.add(article)
    await db.commit()
    await db.refresh(article)
    return ArticleOut.model_validate(article)
