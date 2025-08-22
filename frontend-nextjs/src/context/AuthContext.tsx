'use client'

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authFetcher } from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import useIdleTimeout from '@/hooks/useIdleTimeout';
import { safeAlert } from '@/lib/utils';

interface User {
    username: string,
    email: string,
    name: string
}

interface AuthContextType {
    user: User | null,
    accessToken: string | null,
    setAccessToken: (accessToken: string) => void,
    isAuthenticated: () => boolean,
    isLoading: boolean,
    checkAuth: () => void,
    logout: () => void,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessTokenstate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const isAuthenticated = !!accessToken && !!user; // 파생된 상태

    const checkAuth = useCallback(() => {
        authFetcher('/api/auth/user/me', {
            method: 'GET',
            credentials: 'include'
        }, 'spring',
        ).then(res => {
            setUser(res.data.data);
        }).catch(err => {
            console.error('Auth check failed:', err);
            if (err.message.includes('401')) {
                setUser(null);
                setAccessTokenstate(null);
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
            }
        })
    }, []);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            setAccessTokenstate(token);
            checkAuth();
        }
        setIsLoading(false);
    }, [checkAuth]);

    const setAccessToken = useCallback((accessToken: string) => {
        setAccessTokenstate(accessToken);
        Cookies.set('accessToken', accessToken, { expires: 1/48 }); // 30분
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setAccessTokenstate(null);
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        router.push('/');
    }, [router]);

    const IdleTimeoutHandler = useCallback(() => {
        const handleIdle = () => {
            safeAlert('30분 동안 활동이 없어 자동으로 로그아웃됩니다.');
            logout();
        };
        useIdleTimeout(handleIdle, 1800);
        return null;
    }, [logout]);

    return (
        <AuthContext.Provider value={{ 
            user, 
            accessToken, 
            setAccessToken, 
            isAuthenticated: () => isAuthenticated, 
            isLoading, 
            checkAuth, 
            logout 
        }}>
            {children}
            {isAuthenticated && <IdleTimeoutHandler />}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthProvider;