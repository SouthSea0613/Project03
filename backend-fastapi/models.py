from sqlalchemy import Column, Integer, String
from .database import Base

class Item(Base):
    __tablename__ = "items" # 테이블 이름

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)