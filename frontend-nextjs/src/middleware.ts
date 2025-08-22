import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
    // 인증이 필요한 페이지만 matcher에 명시
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