'use client'

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authFetcher } from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import useIdleTimeout from '@/hooks/useIdleTimeout';

interface User {
    username : string,
    email : string,
    name : string
}

interface AuthContextType {
    user: User | null,
    accessToken: string | null,
    setAccessToken: (accessToken: string) => void,
    isAuthenticated: () => boolean,
    isLoading: boolean,
    checkAuth : () => void,
    logout: () => void,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const IdleTimeoutHandler = () => {
    const { logout } = useAuth();

    const handleIdle = useCallback(() => {
        alert('30분 동안 활동이 없어 자동으로 로그아웃됩니다.');
        logout();
    }, [logout]);

    // 30분 = 1800초
    useIdleTimeout(handleIdle, 1800);

    return null;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessTokenstate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const checkAuth = () =>{
        authFetcher('/api/auth/user/me',{
                method: 'GET',
                credentials:'include'
            },'spring',
        ).then(res => {
            setUser(res.data.data);
        }).catch(err => {
        })
    }

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if(token) {
            setAccessTokenstate(token);
            checkAuth();
            setIsLoggedIn(true);
        }
        setIsLoading(false);
    }, []);

    const setAccessToken = (accessToken: string) => {
        setAccessTokenstate(accessToken);
    }

    const isAuthenticated = () =>{
        return !!user;
    }

    const logout = () =>{
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user,accessToken, setAccessToken, isAuthenticated, isLoading, checkAuth, logout }}>
            {children}
            {isLoggedIn && <IdleTimeoutHandler />}
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