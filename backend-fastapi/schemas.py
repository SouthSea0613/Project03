from pydantic import BaseModel

# 아이템 생성을 위한 스키마 (입력)
class ItemCreate(BaseModel):
    name: str
    description: str | None = None

# 아이템 조회를 위한 스키마 (출력)
class Item(ItemCreate):
    id: int

    class Config:
        from_attributes = True # SQLAlchemy 모델을 Pydantic 모델로 변환 허용