// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// jose 라이브러리는 Edge Runtime에서 JWT를 검증할 때 권장됩니다.
// pnpm add jose 또는 npm install jose
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET; // .env.local 파일에 정의된 JWT 비밀키

// 미들웨어가 실행될 경로를 지정합니다.
export const config = {
    matcher: [
        /*
         * 아래 경로와 일치하는 요청에만 미들웨어가 실행됩니다.
         * - api (API 라우트)
         * - _next/static (정적 파일)
         * - _next/image (이미지 최적화 파일)
         * - favicon.ico (파비콘 파일)
         * ... 제외
         */
        '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
    ],
};

export async function middleware(request: NextRequest) {
    // 쿠키에서 JWT 토큰을 가져옵니다. (로그인 시 서버에서 httpOnly 쿠키로 설정하는 것이 더 안전합니다)
    // 여기서는 이전 답변과 같이 localStorage를 사용했다는 가정하에 헤더에서 토큰을 가져옵니다.
    // 실제로는 쿠키에서 가져오는 것이 더 일반적입니다.
    const token = request.headers.get('Authorization')?.split(' ')[1] || request.cookies.get('jwt')?.value;

    const { pathname } = request.nextUrl;

    // 토큰이 없는 경우 로그인 페이지로 리디렉션
    if (!token) {
        // 로그인 페이지 자체로의 요청이 아니라면 리디렉션
        if (pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        // JWT 토큰 유효성 검증
        const secret = new TextEncoder().encode(JWT_SECRET_KEY);
        await jwtVerify(token, secret);

        // 토큰이 유효하면 요청을 그대로 통과시킴
        return NextResponse.next();
    } catch (error) {
        // 토큰 검증 실패 시 (만료 등)
        console.error('JWT Verification Error:', error);

        // 기존 쿠키를 삭제하고 로그인 페이지로 리디렉션
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('jwt');
        return response;
    }
}