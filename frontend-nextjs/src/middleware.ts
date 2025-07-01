import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET;

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|auth/).*)',
    ],
};

export async function middleware(request: NextRequest) {
    const token = request.headers.get('Authorization')?.split(' ')[1] || request.cookies.get('jwt')?.value;

    const { pathname } = request.nextUrl;

    if (!token) {
        if (pathname !== '/login') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        const secret = new TextEncoder().encode(JWT_SECRET_KEY);
        await jwtVerify(token, secret);

        return NextResponse.next();
    } catch (error) {
        console.error('JWT Verification Error:', error);

        const response = NextResponse.redirect(new URL('', request.url));
        response.cookies.delete('jwt');
        return response;
    }
}