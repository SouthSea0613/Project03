import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET;

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|auth/|signup).*)',
        '/',
    ],
};

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;
    console.log(request);
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
        console.log('ddd : ' + pathname);
        if (pathname === '/auth/login' || pathname === '/auth/signup') {

            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('token');
        return response;
    }
}