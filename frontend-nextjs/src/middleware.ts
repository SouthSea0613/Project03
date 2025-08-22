import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET;
const SPRING_API_URL = process.env.NEXT_PUBLIC_SPRING_API_URL || "http://localhost:8080";

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
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

        // refreshToken이 있을 때만 checkAuth API 호출
        if (refreshToken) {
            try {
                const response = await fetch(`${SPRING_API_URL}/api/auth/checkAuth`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': `refreshToken=${refreshToken}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (!data.success) {
                        // 다른 컴퓨터에서 로그인된 경우 쿠키 삭제
                        const redirectResponse = NextResponse.redirect(new URL('/auth/login', request.url));
                        redirectResponse.cookies.delete('accessToken');
                        redirectResponse.cookies.delete('refreshToken');
                        return redirectResponse;
                    }
                }
            } catch (error) {
                // checkAuth 실패 시 로그인 페이지로 리다이렉트
                const redirectResponse = NextResponse.redirect(new URL('/auth/login', request.url));
                redirectResponse.cookies.delete('accessToken');
                redirectResponse.cookies.delete('refreshToken');
                return redirectResponse;
            }
        }

        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
    }
}