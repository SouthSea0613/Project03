import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

# .env 파일에서 환경 변수 로드
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# 비동기 엔진 생성
engine = create_async_engine(DATABASE_URL)

# 비동기 세션 생성기
AsyncSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

# SQLAlchemy 모델의 기본 클래스
Base = declarative_base()

# API 경로에서 데이터베이스 세션을 주입하기 위한 함수
async def get_db():
    async with AsyncSessionLocal() as db:
        yield db