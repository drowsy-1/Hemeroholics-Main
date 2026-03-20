import asyncio
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import subscribers, articles


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Retry DB connection — Railway networking can take a moment
    for attempt in range(5):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            print("[hemeroholics] Database connected and tables created.")
            break
        except Exception as e:
            print(f"[hemeroholics] DB connection attempt {attempt + 1}/5 failed: {e}")
            if attempt < 4:
                await asyncio.sleep(2 ** attempt)
            else:
                print("[hemeroholics] Could not connect to database after 5 attempts.")
    yield
    await engine.dispose()


app = FastAPI(
    title="Hemeroholics API",
    description="Backend API for Hemeroholics — mailing list and blog articles",
    version="1.0.0",
    lifespan=lifespan,
)

raw_origins = os.getenv("ALLOWED_ORIGINS", "")
print(f"[hemeroholics] ALLOWED_ORIGINS env var: '{raw_origins}'")

if raw_origins:
    allowed_origins = [o.strip() for o in raw_origins.split(",")]
else:
    # Fallback: allow common local dev origins
    allowed_origins = ["http://localhost:5500", "http://127.0.0.1:5500"]

print(f"[hemeroholics] CORS allow_origins: {allowed_origins}")

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
