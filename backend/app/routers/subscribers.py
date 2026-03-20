import time
from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Subscriber
from app.schemas import SubscribeRequest, SubscribeResponse

router = APIRouter(prefix="/api", tags=["subscribers"])

# Simple in-memory rate limiter: max 5 subscribe attempts per IP per minute
_rate_limit: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_MAX = 5
RATE_LIMIT_WINDOW = 60  # seconds


def check_rate_limit(request: Request):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    # Prune old entries
    _rate_limit[ip] = [t for t in _rate_limit[ip] if now - t < RATE_LIMIT_WINDOW]
    if len(_rate_limit[ip]) >= RATE_LIMIT_MAX:
        raise HTTPException(status_code=429, detail="Too many requests. Try again later.")
    _rate_limit[ip].append(now)


@router.post("/subscribe", response_model=SubscribeResponse)
async def subscribe(
    body: SubscribeRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    check_rate_limit(request)

    result = await db.execute(
        select(Subscriber).where(Subscriber.email == body.email)
    )
    existing = result.scalar_one_or_none()

    if existing:
        if existing.is_active:
            raise HTTPException(status_code=409, detail="Email already subscribed")
        existing.is_active = True
        await db.commit()
        return SubscribeResponse(message="Welcome back! Subscription reactivated.", email=body.email)

    subscriber = Subscriber(email=body.email)
    db.add(subscriber)
    await db.commit()
    return SubscribeResponse(message="Successfully subscribed!", email=body.email)
