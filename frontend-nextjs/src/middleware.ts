import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET;

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|auth/).*)',
        '/'
    ],
};

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const fullUrl = request.url;

    const { pathname } = request.nextUrl;
    const allowedPaths = ['/','/auth/login', '/auth/signup'];
    console.log("토큰이야"+token);
    if (!token) {
        console.log("토큰있어?")
        if (!allowedPaths.includes(pathname) && !pathname.startsWith('/auth/login')) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        const secret = new TextEncoder().encode(JWT_SECRET_KEY);
        console.log("시크릿"+ secret);
        console.log("토큰" +token);
        await jwtVerify(token, secret);
        console.log(fullUrl)
        console.log(pathname)
        return NextResponse.next();
    } catch (error) {
        console.error('JWT Verification Error:', error);

        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('token');
        return response;
    }
}