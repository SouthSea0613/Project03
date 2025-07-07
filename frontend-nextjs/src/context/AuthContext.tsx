'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { springFetcher } from "@/lib/api";
import {router} from "next/client";

interface User {
    username: string,
    email: string,
    name: string
}

interface AuthContextType {
    // user: User | null,
    accessToken: string | null,
    setAccessToken: (token: string) => void,
    isAuthenticated: boolean,
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessTokenstate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(token) {
            setAccessTokenstate(token);
        }
        setIsLoading(false);
    }, []);

    const setAccessToken = (token: string) => {
        setAccessTokenstate(token);
        if(token) {
            localStorage.setItem('accessToken', token);
        }else{
            localStorage.removeItem('accessToken');
        }
    }

    const isAuthenticated = !!accessToken;

    const logout = () => {
        // document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        springFetcher('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        }).then(()=>{
            alert("로그아웃되었습니다")
            router.push("/");
        }).catch(err => {
            console.log(err)
        })
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, isAuthenticated, isLoading}}>
            {children}
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