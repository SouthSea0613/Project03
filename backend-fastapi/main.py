from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# FastAPI 앱 인스턴스 생성
app = FastAPI(
    title="Project03",
    version="1.0.0",
    description="Project03",
    # docs_url="/api-docs",  # Swagger UI 경로를 /docs에서 /api-docs로 변경
    # redoc_url=None         # ReDoc을 비활성화
)

# 허용할 출처(Origin) 목록
origins = [
    "http://localhost:3000", # Next.js 프론트엔드 주소
]

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # origins 목록에 있는 출처의 요청을 허용
    allow_credentials=True,      # 쿠키 등 자격 증명 허용
    allow_methods=["*"],         # 모든 HTTP 메서드 허용
    allow_headers=["*"],         # 모든 HTTP 헤더 허용
)

# 테스트용 API 엔드포인트
@app.get("/api/test")
def read_root():
    return {"message": "FastAPI에서 보낸 메시지입니다"}