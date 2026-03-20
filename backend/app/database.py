import logging
import os

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

logger = logging.getLogger("hemeroholics")

DATABASE_URL = os.getenv("DATABASE_URL", "")

if not DATABASE_URL:
    logger.warning("DATABASE_URL not set! Using fallback localhost connection.")
    DATABASE_URL = "postgresql+asyncpg://postgres:password@localhost:5432/hemeroholics"

# Railway provides DATABASE_URL with postgresql:// prefix; swap to asyncpg
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Log redacted URL for debugging
if "@" in DATABASE_URL:
    host_part = DATABASE_URL.split("@")[-1]
    logger.info(f"Connecting to database at: ...@{host_part}")

engine = create_async_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with async_session() as session:
        yield session
