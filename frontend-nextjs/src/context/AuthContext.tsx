'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { springFetcher } from "@/lib/api";

interface User {
    username: string,
    email: string,
    name: string
}

interface AuthContextType {
    user: User | null,
    isLoading: boolean,
    isLoggedIn: boolean,
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await springFetcher('/api/auth/user/me', {
                method: 'GET',
                credentials: 'include'
            });
            setUser(res.data.data);
        } catch (err) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = (token: string) => {
        document.cookie = `token=${token}; path=/;`;
        checkAuth();
    };

    const logout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
    };

    const value = {
        user,
        isLoading,
        isLoggedIn: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
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