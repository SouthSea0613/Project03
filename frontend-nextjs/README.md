# Project03 Frontend

## 환경 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# API URLs
NEXT_PUBLIC_SPRING_API_URL=http://localhost:8080
NEXT_PUBLIC_FASTAPI_API_URL=http://localhost:8000

# JWT Secret (백엔드와 동일해야 함)
JWT_SECRET=7Iqk7YyM66W07YOA7L2U65Sp7YWl66aJ7IS47Yq466W07JeQ7YSw7LWc7YOA7L2U67aA
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 주요 기능

- JWT 듀얼토큰 인증
- 자동 토큰 갱신
- 보안 쿠키 설정
- 자동 로그아웃 (30분 비활성)
- 반응형 UI

## 접속 정보

- **개발 서버**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
