import asyncio
import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import subscribers, articles

logger = logging.getLogger("hemeroholics")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Retry DB connection — Railway networking can take a moment
    for attempt in range(5):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Database connected and tables created.")
            break
        except Exception as e:
            logger.warning(f"DB connection attempt {attempt + 1}/5 failed: {e}")
            if attempt < 4:
                await asyncio.sleep(2 ** attempt)
            else:
                logger.error("Could not connect to database after 5 attempts. Starting without DB.")
    yield
    await engine.dispose()


app = FastAPI(
    title="Hemeroholics API",
    description="Backend API for Hemeroholics — mailing list and blog articles",
    version="1.0.0",
    lifespan=lifespan,
)

raw_origins = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500"
)
allowed_origins = [o.strip() for o in raw_origins.split(",")]
logger.info(f"CORS allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(subscribers.router)
app.include_router(articles.router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "Hemeroholics API"}
