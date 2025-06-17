from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas

async def create_item(db: AsyncSession, item: schemas.ItemCreate):
    # Pydantic 모델을 SQLAlchemy 모델로 변환
    db_item = models.Item(name=item.name, description=item.description)
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item