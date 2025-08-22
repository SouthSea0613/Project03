import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET;

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;
    const allowedPaths = ['/', '/auth/login', '/auth/signup'];

    if (!token) {
        if (!allowedPaths.includes(pathname) && !pathname.startsWith('/auth/login')) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        if(!JWT_SECRET_KEY) {
            throw new Error("jwt없어");
        }

        const secret = new TextEncoder().encode(JWT_SECRET_KEY);
        await jwtVerify(token, secret);

        if (pathname === '/auth/login' || pathname === '/auth/signup') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // 미들웨어에서는 API 호출을 피하고 JWT 검증만 수행
        // 추가적인 인증 검증은 클라이언트 사이드에서 처리

        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
    }
}