# Gemini 가이드: Project03

이 문서는 Gemini AI 어시스턴트가 이 프로젝트를 이해하고 효과적으로 지원하기 위한 가이드입니다.

## 1. 프로젝트 개요

- **핵심 목표**: 프로젝트를 중심으로 사람들을 연결하고, 팀 구성, 프로젝트 의뢰 및 수주를 중개하는 플랫폼 구축.
- **주요 기능**:
  - 프로젝트 생성 및 팀원 모집 공고
  - 프로젝트 참여 및 팀 가입
  - 프로젝트 의뢰 및 수주
  - 거래 발생 시 수수료 기반의 수익 모델
- **미래 비전**:
  - TensorFlow 기반 AI를 통한 맞춤 유저 추천 기능
  - Slack, Notion과 같은 프로젝트 관리 및 협업 도구 제공

## 2. 기술 스택

- **백엔드**: Java, Spring Boot, Gradle, Python, FastAPI, TensorFlow
- **프론트엔드**: TypeScript, Next.js, React, Tailwind CSS
- **데이터베이스**: PostgreSQL

## 3. 프로젝트 구조

- `backend-spring/`: **Java/Spring Boot 백엔드.** 기본적인 데이터 처리(CRUD), 사용자 인증 등 핵심 비즈니스 로직을 담당합니다.
- `backend-fastapi/`: **Python/FastAPI 백엔드.** 수집된 사용자 데이터를 바탕으로 TensorFlow 모델을 사용하여 적합한 사용자를 추천하는 AI 연산을 담당합니다.
- `frontend-nextjs/`: **TypeScript/Next.js 프론트엔드.** 사용자에게 보여지는 모든 화면과 상호작용을 담당합니다.

## 4. 주요 명령어

**항상 각 디렉토리로 이동한 후 명령어를 실행해주세요.**

### 프론트엔드 (`frontend-nextjs` 디렉토리)

- **의존성 설치**: `pnpm install`
- **개발 서버 실행**: `pnpm run dev`
- **빌드**: `pnpm run build`
- **코드 스타일 검사 (Lint)**: `pnpm run lint`

### 백엔드 (`backend-spring` 디렉토리)

- **빌드**: `./gradlew build`
- **개발 서버 실행**: `./gradlew bootRun`

## 5. 코딩 컨벤션 및 규칙

- 프론트엔드 코드는 `.eslintrc.json`의 규칙을 따릅니다.
- 커밋 메시지는 "[타입] 설명" 형식으로 작성합니다. (예: [Feat] 로그인 기능 추가)
- (그 외 특별한 규칙이 있다면 여기에 추가해주세요.)

## 6. 주의사항

- `.env` 또는 `application.yml` 파일에 포함된 민감한 정보는 절대 코드에 직접 노출하지 마세요.
- 새로운 라이브러리를 추가할 때는 반드시 팀과 상의해주세요.
