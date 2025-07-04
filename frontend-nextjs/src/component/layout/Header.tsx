'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
    const { isLoggedIn, user, logout, isLoading } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/'); // 로그아웃 후 메인 페이지로 이동
    };

    return (
        <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 w-full">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-2xl font-bold text-text-main">
                    DevConnect
                </Link>

                <nav className="hidden md:flex items-center space-x-6 text-text-main">
                    <Link href="/projects" className="hover:text-primary transition-colors">프로젝트 찾기</Link>
                    <Link href="/recruit" className="hover:text-primary transition-colors">팀원 모집</Link>
                    <Link href="/requests" className="hover:text-primary transition-colors">프로젝트 요청</Link>
                </nav>

                <div className="flex items-center space-x-4">
                    {isLoading ? (
                        <div className="h-8 w-24 bg-border rounded-md animate-pulse"></div>
                    ) : isLoggedIn ? (
                        <>
                            <span className="text-text-secondary">환영합니다, {user?.name}님!</span>
                            <Link href="/mypage" className="text-text-main hover:text-primary transition-colors">마이페이지</Link>
                            <button onClick={handleLogout} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="text-text-main hover:text-primary transition-colors">
                                로그인
                            </Link>
                            <Link href="/auth/signup" className="bg-accent text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                                회원가입
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;