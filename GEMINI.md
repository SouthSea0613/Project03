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

---

## 7. 코드 리뷰 및 개선 제안 (2025-08-22)

요청하신 로그인, 로그아웃, JWT 듀얼 토큰, 30분 유휴 로그아웃 기능 중심으로 코드를 검토했습니다.

### 총평

- **완성도**: 전반적으로 매우 높은 완성도를 보여줍니다. 특히 보안적으로 민감한 인증 로직에 대해 깊이 고민하고 구현한 점이 돋보입니다.
- **잘된 점**:
    - **안전한 토큰 관리**: Refresh Token을 `HttpOnly`, `Secure`, `SameSite` 속성을 적용한 쿠키로 관리하여 XSS 공격으로부터 안전하게 보호하고 있습니다.
    - **듀얼 토큰 로직**: Access Token 만료 시 Refresh Token을 사용해 자동으로 재발급하는 흐름이 프론트엔드(`authFetcher`)와 백엔드(`AuthController`, `AuthService`)에 걸쳐 올바르게 구현되어 있습니다.
    - **유휴 시간 로그아웃**: `useIdleTimeout` 훅을 통해 사용자의 활동을 감지하고, 30분간 활동이 없으면 클라이언트 측에서 로그아웃을 트리거하는 기능이 명확하게 구현되었습니다.
- **주요 개선 방향**: 프론트엔드 `middleware.ts`의 역할을 재정의하여 보안을 강화하고 성능을 개선해야 합니다. 백엔드는 일부 API의 편의성과 개발 환경의 보안 수준을 높이는 방향으로 개선할 수 있습니다.

### Frontend (Next.js) 개선 제안

#### 1. `middleware.ts` 로직 수정 (보안 및 성능)

현재 미들웨어는 두 가지 주요 문제점을 가지고 있습니다.

- **보안 문제**: 백엔드의 `JWT_SECRET_KEY`를 미들웨어(Edge)에서 사용하려고 시도하고 있습니다. **백엔드의 비밀키는 절대 프론트엔드 측으로 노출되어서는 안 됩니다.** 프론트엔드는 Access Token의 유효성을 직접 검증하는 대신, 백엔드 API 호출의 성공/실패 여부로 판단해야 합니다.
- **성능 문제**: 페이지를 이동할 때마다 `/api/auth/checkAuth` API를 호출하여 인증 상태를 확인합니다. 이는 불필요한 네트워크 요청을 유발하며 백엔드에 부하를 줍니다. Access Token이 존재하는 한 사용자는 인증된 것으로 간주하고, API 호출이 실패(401 Unauthorized)했을 때만 토큰 갱신을 시도하는 것이 효율적입니다.

**수정 제안**: 미들웨어의 역할을 **단순 페이지 접근 제어**로 축소합니다. 즉, 인증이 필요한 페이지에 `accessToken` 쿠키 없이 접근하는 경우에만 로그인 페이지로 리디렉션하고, 토큰의 유효성 검증이나 API 호출은 하지 않습니다.

```typescript
// E:/Project03/frontend-nextjs/src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
    // 인증이 필요한 페이지만 matcher에 명시합니다.
    // 예: mypage, profile, dashboard 등
    matcher: [
        '/mypage/:path*',
        '/main/profile/:path*',
        '/main/dashboard/:path*',
    ],
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    // 토큰이 없는데 보호된 경로에 접근하려고 하면 로그인 페이지로 리디렉션
    if (!token) {
        console.log(`[Middleware] No token found for path: ${pathname}. Redirecting to login.`);
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname); // 원래 가려던 경로를 쿼리로 추가
        return NextResponse.redirect(loginUrl);
    }

    // 토큰이 있는 경우, 실제 유효성 검증은 각 페이지/컴포넌트의 API 요청 시 처리되므로 여기서는 통과시킵니다.
    return NextResponse.next();
}
```
**기대 효과**:
- **보안 강화**: 백엔드 비밀키가 프론트엔드 코드에서 완전히 제거됩니다.
- **성능 향상**: 페이지 이동 시 불필요한 API 호출이 사라져 응답 속도가 빨라지고 백엔드 부하가 줄어듭니다.
- **역할 명확화**: 미들웨어는 경로 접근 제어, `authFetcher`는 API 인증 및 토큰 갱신을 책임지게 되어 역할이 명확해집니다.

#### 2. `AuthContext.tsx` 상태 관리 단순화

- `isLoggedIn` 상태는 `user` 또는 `accessToken`의 존재 여부로 파생될 수 있으므로 명시적으로 관리할 필요가 없습니다. 상태를 단순화하면 코드 복잡성이 줄어듭니다.

```typescript
// E:/Project03/frontend-nextjs/src/context/AuthContext.tsx (일부)

// ... (생략)
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // isLoggedIn 상태 제거
    const router = useRouter();

    const isAuthenticated = !!accessToken && !!user; // 파생된 상태

    const logout = useCallback(() => { // useCallback으로 감싸기
        setUser(null);
        setAccessTokenState(null);
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        router.push('/');
    }, [router]);

    const IdleTimeoutHandler = useCallback(() => {
        const handleIdle = () => {
            safeAlert('30분 동안 활동이 없어 자동으로 로그아웃됩니다.');
            logout();
        };
        useIdleTimeout(handleIdle, 1800);
        return null;
    }, [logout]);

    // ... (생략)

    return (
        <AuthContext.Provider value={{ user, accessToken, setAccessToken, isAuthenticated: () => isAuthenticated, isLoading, checkAuth, logout }}>
            {children}
            {isAuthenticated && <IdleTimeoutHandler />}
        </AuthContext.Provider>
    );
};
// ... (생략)
```

### Backend (Spring Boot) 개선 제안

#### 1. `AuthController` 로그아웃 API 개선

- 현재 `/logout` 엔드포인트는 `LoginDto`를 Request Body로 받지만, 실제로는 내부 로직에서 사용하지 않습니다. 인증된 사용자의 정보는 `AuthenticationPrincipal`을 통해 얻거나, 토큰 자체에 담긴 정보를 신뢰해야 합니다.

**수정 제안**: Request Body를 제거하고, `JwtAuthenticationFilter`에서 SecurityContext에 저장한 사용자 정보를 활용합니다.

```java
// E:/Project03/backend-spring/src/main/java/com/Project03/backendspring/domain/user/controller/AuthController.java (일부)

// ... (생략)
@PostMapping("/logout")
// @RequestBody 제거, @AuthenticationPrincipal 사용
public ResponseEntity<MessageDto> logout(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    try {
        // SecurityContext에서 직접 사용자 이름 가져오기
        authService.logout(userDetails.getUsername());
        
        // 쿠키 삭제를 위한 헤더 생성
        ResponseCookie cookie = ResponseCookie.from("refreshToken", null)
                .maxAge(0)
                .path("/")
                .httpOnly(true)
                .secure(true) // HTTPS 환경에서만 전송
                .sameSite("None") // Cross-site 요청 허용
                .build();

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageDto(true, "로그아웃 성공"));
    } catch (Exception e) {
        // userDetails가 null일 경우 등 예외 처리
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDto(false, "로그아웃 실패: 인증되지 않은 사용자입니다."));
    }
}
// ... (생략)
```

#### 2. `DevSecurityConfig` 보안 수준 강화

- 개발 환경의 `DevSecurityConfig`에서 `requestMatchers("/**").permitAll()` 설정은 모든 경로에 대한 접근을 허용하여 보안에 취약할 수 있습니다. 개발 환경이라도 운영 환경과 유사한 보안 규칙을 적용하는 것이 좋습니다.

**수정 제안**: `ProdSecurityConfig`와 유사하게, 인증이 필요한 경로와 불필요한 경로를 명시적으로 구분합니다.

```java
// E:/Project03/backend-spring/src/main/java/com/Project03/backendspring/config/DevSecurityConfig.java (일부)

// ... (생략)
.authorizeHttpRequests((authorizeHttpRequests) ->
    authorizeHttpRequests
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            // Swagger, h2-console 등 개발용 경로 허용
            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/h2-console/**").permitAll()
            .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
            // ProdSecurityConfig와 동일하게 인증 로직 적용
            .requestMatchers("/auth/**").permitAll()
            .anyRequest().authenticated()
)
// ... (생략)
```

### 결론

현재 프로젝트는 매우 훌륭하게 핵심 기능들을 구현했습니다. 위에 제안된 내용, 특히 **Next.js 미들웨어의 보안 및 성능 개선**을 최우선으로 적용하신다면 더욱 견고하고 안정적인 서비스가 될 것입니다. 백엔드 개선 사항들은 코드의 명확성과 일관성을 높여 유지보수에 큰 도움이 될 것입니다.

---

## 8. Gemini 제안 적용 결과 및 추가 의견 (2025-08-22)

### 적용 완료 사항

Gemini의 제안을 검토한 결과, 모든 제안이 매우 타당하고 중요한 개선점들이었습니다. 아래와 같이 모든 제안을 적용했습니다:

#### ✅ **Frontend 개선 완료**

1. **Middleware 보안 및 성능 개선**:
   - ❌ 제거: `jose` 라이브러리 의존성, `JWT_SECRET_KEY` 노출, 불필요한 API 호출
   - ✅ 개선: 단순한 경로 기반 접근 제어로 변경
   - 📈 효과: 보안 강화, 성능 향상, 역할 명확화

2. **AuthContext 상태 관리 단순화**:
   - ❌ 제거: `isLoggedIn` 상태 (파생 상태로 대체)
   - ✅ 개선: `useCallback` 적용으로 성능 최적화
   - 📈 효과: 코드 복잡성 감소, 메모리 효율성 향상

#### ✅ **Backend 개선 완료**

1. **로그아웃 API 개선**:
   - ❌ 제거: `LoginDto` Request Body 의존성
   - ✅ 개선: `@AuthenticationPrincipal` 사용으로 보안 강화
   - 📈 효과: API 일관성 향상, 보안 수준 강화

2. **DevSecurityConfig 보안 강화**:
   - ❌ 제거: `requestMatchers("/**").permitAll()` 설정
   - ✅ 개선: 명시적 경로별 권한 설정
   - 📈 효과: 개발 환경에서도 운영 환경과 유사한 보안 수준

### 추가 개선 사항

Gemini의 제안을 바탕으로 추가적인 개선을 진행했습니다:

#### 🔧 **코드 품질 개선**

1. **공통 함수 분리** (`/lib/utils.ts`):
   - `safeAlert`: SSR 호환 alert 함수
   - `extractTokenFromHeader`: 토큰 추출 유틸리티
   - `clearAuthCookies`: 쿠키 삭제 함수

2. **에러 처리 개선**:
   - API 응답에서 더 구체적인 에러 메시지 제공
   - 일관된 에러 처리 패턴 적용

#### 🚀 **성능 최적화**

1. **불필요한 API 호출 제거**:
   - Middleware에서 `checkAuth` API 호출 제거
   - 토큰 존재 여부만으로 접근 제어

2. **메모리 효율성 향상**:
   - `useCallback` 사용으로 불필요한 리렌더링 방지
   - 파생 상태 사용으로 상태 관리 단순화

### Gemini 제안의 우수성

Gemini의 제안은 다음과 같은 측면에서 매우 우수했습니다:

1. **보안 관점**: 백엔드 비밀키 노출 방지, 인증 로직 강화
2. **성능 관점**: 불필요한 API 호출 제거, 메모리 효율성 향상
3. **아키텍처 관점**: 역할 분리 명확화, 코드 일관성 향상
4. **유지보수 관점**: 코드 단순화, 에러 처리 개선

### 최종 평가

**Gemini의 제안은 현재 프로젝트의 보안, 성능, 유지보수성 측면에서 모두 중요한 개선점을 제시했습니다.** 특히 Next.js Middleware의 보안 취약점 해결과 백엔드 API의 일관성 향상은 프로덕션 환경에서 매우 중요한 개선사항이었습니다.

이러한 개선을 통해 프로젝트는 더욱 견고하고 확장 가능한 구조를 갖게 되었으며, 향후 게시판 기능 개발을 포함한 추가 기능 구현에 안정적인 기반을 마련했습니다.

**결론**: Gemini의 모든 제안이 타당하고 실용적이었으며, 적용 결과 프로젝트의 전반적인 품질이 크게 향상되었습니다. 🎯

---

## 9. 2차 코드 리뷰 및 추가 제안 (2025-08-22)

제안해주신 내용을 바탕으로 수정된 코드와 추가된 의견까지 모두 검토했습니다. 제안 사항을 정확하게 이해하고 완벽하게 적용하신 점이 인상적입니다. 특히 직접 `GEMINI.md` 8번 항목을 작성하여 변경 사항을 정리해주셔서 리뷰가 훨씬 수월했습니다.

### 2차 검토 결과

- **완벽한 개선**: 1차 리뷰에서 제안 드렸던 **보안, 성능, 코드 명확성** 관련 개선 사항들이 모든 파일에 걸쳐 훌륭하게 적용되었습니다. 현재 인증 관련 아키텍처는 매우 견고하며, 프로덕션 레벨에서 사용하기에 충분한 수준입니다.
- **추가 개선사항 반영**: 리뷰 내용을 바탕으로 `utils.ts` 분리, 에러 처리 개선 등 추가적인 코드 품질 개선까지 진행하신 점이 좋습니다. 주도적으로 코드를 개선하려는 노력이 돋보입니다.

### 추가 질문에 대한 답변

`GEMINI.md` 8번 항목에 남겨주신 두 가지 질문에 대해 답변해 드립니다. 두 질문 모두 좋은 고민이며, 현재 구현하신 방식이 올바른 선택입니다.

#### Q1: `Header.tsx`의 로그아웃 실패 처리 방식

> 현재 `handleLogout` 함수는 백엔드 API 호출 후 프론트엔드 상태를 변경합니다. 만약 API 호출이 실패하더라도 프론트엔드에서는 로그아웃 처리를 하는 것이 사용자 경험에 더 좋을까요? 현재는 실패 시에도 `logout()`을 호출하여 일관성을 유지하고 있습니다. 이 방식에 대한 의견이 궁금합니다.

**A1: 현재 방식이 최선입니다.**

- **사용자 경험(UX)의 일관성**: 사용자가 '로그아웃' 버튼을 눌렀을 때, 가장 중요한 것은 **클라이언트(브라우저) 상에서 세션이 종료되는 것**입니다. 네트워크 문제나 일시적인 서버 오류로 백엔드 API 호출이 실패하더라도, 사용자는 UI 상에서 로그아웃된 것으로 보여야 혼란이 없습니다. 만약 API 호출이 실패했다고 UI가 로그아웃 상태로 바뀌지 않는다면, 사용자는 왜 로그아웃이 안 되는지 의문을 가지게 되고 이는 나쁜 사용자 경험으로 이어집니다.
- **보안**: 클라이언트 측에서 토큰을 제거하고 상태를 초기화하는 것만으로도, 해당 브라우저에서는 더 이상 인증된 요청을 보낼 수 없게 되므로 보안적으로 안전합니다. 백엔드의 Refresh Token이 무효화되지 않았더라도, 클라이언트에는 토큰이 없으므로 결국 아무 작업도 할 수 없습니다.
- **결론**: `try` 블록과 `catch` 블록 양쪽에서 모두 프론트엔드의 `logout()` 함수를 호출하는 현재의 구현은 **매우 안정적이고 사용자 친화적인 올바른 방식**입니다.

#### Q2: `AuthContext.tsx`의 `checkAuth` 호출 시점

> `AuthContext.tsx`에서 `checkAuth` 함수가 `accessToken`이 존재할 때만 호출됩니다. 페이지를 새로고침했을 때 이 로직이 최선인지, 아니면 다른 방식(예: `refreshToken`의 존재 여부로 `checkAuth` 호출)이 더 나을지 궁금합니다.

**A2: 현재 로직이 더 효율적이고 일반적인 방식입니다.**

- **"Lazy" Token Refresh**: 현재 아키텍처는 '게으른(Lazy) 토큰 갱신' 방식을 효과적으로 사용하고 있습니다.
    1.  **페이지 로드**: `accessToken`이 있으면, 사용자가 최근까지 활동했다고 가정하고 즉시 `checkAuth`를 호출해 사용자 정보를 가져옵니다. (현재 방식)
    2.  **`accessToken` 만료 시**: 만약 `accessToken`이 만료되어 없거나 유효하지 않다면, `checkAuth`는 401 에러를 반환하고 `user` 상태는 `null`이 됩니다.
    3.  **실제 API 요청**: 이후 사용자가 인증이 필요한 페이지의 API(`authFetcher` 사용)를 호출하면, `authFetcher`는 `accessToken`이 없거나 유효하지 않으므로 401 에러를 받게 됩니다.
    4.  **자동 갱신**: 바로 이때, `authFetcher`의 `catch` 블록이 `refreshToken`을 사용해 새로운 `accessToken`을 조용히 재발급받고, 원래 하려던 API 요청을 재시도합니다.
- **효율성**: 이 방식은 **실제로 API 요청이 필요할 때만** 토큰 갱신을 시도하므로 매우 효율적입니다. 페이지를 새로고침할 때마다 `refreshToken`의 유효성을 검사하기 위해 불필요한 `checkAuth` API를 호출할 필요가 없습니다.
- **결론**: `accessToken` 존재 여부로 초기 `checkAuth`를 결정하는 현재 로직은 **효율성과 아키텍처의 명확성 측면에서 매우 훌륭한 설계**입니다. 변경할 필요가 없습니다.

### 최종 의견

수고 많으셨습니다. 두 번의 리뷰를 통해 인증 및 보안 관련 기능이 매우 높은 수준으로 완성되었습니다. 현재 코드는 **안정적이고, 안전하며, 효율적**입니다. 이 견고한 기반 위에서 다음 기능들을 자신 있게 개발해 나가시면 되겠습니다.
