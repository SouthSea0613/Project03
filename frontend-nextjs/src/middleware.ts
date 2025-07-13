import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import {springFetcher} from "@/lib/api";
import {useAuth} from "@/context/AuthContext";

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
        springFetcher('/api/auth/checkAuth',{
            method: 'POST',
            credentials: 'include',
        }).then((res)=>{
            if(res.data.success){
                alert("다른 컴퓨터에서 로그인 되었습니다")
                alert("로그아웃 됩니다")
            }else{
                console.log("로그인 유지")
            }
        }).catch(()=>{
            alert("에러발생")
        })

        return NextResponse.next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('token');
        return response;
    }
}