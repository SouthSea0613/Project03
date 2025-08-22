import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
    matcher: [
        '/mypage/:path*',
        '/main/profile/:path*',
        '/main/dashboard/:path*',
    ],
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    if (!token) {
        console.log(`[Middleware] No token found for path: ${pathname}. Redirecting to login.`);
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}