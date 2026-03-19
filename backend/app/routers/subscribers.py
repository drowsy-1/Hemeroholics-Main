from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Subscriber
from app.schemas import SubscribeRequest, SubscribeResponse

router = APIRouter(prefix="/api", tags=["subscribers"])


@router.post("/subscribe", response_model=SubscribeResponse)
async def subscribe(body: SubscribeRequest, db: AsyncSession = Depends(get_db)):
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
