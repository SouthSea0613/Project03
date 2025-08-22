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
        if (!JWT_SECRET_KEY) {
            console.error('JWT_SECRET_KEY is not defined');
            throw new Error('JWT secret key is not configured');
        }

        const secret = new TextEncoder().encode(JWT_SECRET_KEY);
        await jwtVerify(token, secret);

        // 로그인된 사용자가 로그인/회원가입 페이지에 접근하는 경우 홈으로 리다이렉트
        if (pathname === '/auth/login' || pathname === '/auth/signup') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        
        // 토큰이 유효하지 않은 경우 쿠키 삭제 후 로그인 페이지로 리다이렉트
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
    }
}