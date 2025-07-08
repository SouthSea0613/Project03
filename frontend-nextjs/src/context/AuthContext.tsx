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
    user: User | null,
    accessToken: string | null,
    setAccessToken: (accessToken: string) => void,
    isAuthenticated: () => boolean,
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
            springFetcher('/api/auth/user/me',{
                method: 'GET',
                credentials:'include'
            }).then(res => {
                console.log(res);
                setUser(res.data.data)
            }).catch(err => {
                console.log(err);
            })
        }
        setIsLoading(false);
    }, []);

    const setAccessToken = (accessToken: string) => {
        setAccessTokenstate(accessToken);
        if(accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }else{
            localStorage.removeItem('accessToken');
        }
    }

    const isAuthenticated = () =>{
        return !!localStorage.getItem('accessToken');
    }

    return (
        <AuthContext.Provider value={{ user,accessToken, setAccessToken, isAuthenticated, isLoading}}>
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