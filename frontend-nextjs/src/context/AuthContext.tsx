'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authFetcher, springFetcher } from "@/lib/api";
import Cookies from "js-cookie";

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

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessTokenstate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = () =>{
        authFetcher('/api/auth/user/me',{
                method: 'GET',
                credentials:'include'
            },'spring',
        ).then(res => {
            console.log(res);
            setUser(res.data.data);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if(token) {
            setAccessTokenstate(token);
            checkAuth();
        }
        setIsLoading(false);
    }, []);

    const setAccessToken = (accessToken: string) => {
        console.log("auth" + accessToken)
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