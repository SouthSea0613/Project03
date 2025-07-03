'use client'
import React, {useCallback, useContext, useEffect, useState} from "react";
import {springFetcher} from "@/lib/api";

interface User{
    username: string,
    email: string,
    name :string
}
interface AuthContextType{
    user: User | null,
    isLoading: boolean,
    isLoggedIn: boolean,
    checkAuth: () => void,
}

const AuthContext = React.createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isLoggedIn: false,
    checkAuth: () => {
    }
});

const AuthProvider = ({ children }:{children:React.ReactNode}) => {
    const [isLoggedIn,setIsLoggedIn] = useState(false)
    const [user,setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading,setIsLoading] = useState(true)
    const checkAuth = useCallback(async ()=>{
        springFetcher('/api/auth/user/me',{
            method: 'GET',
            credentials:'include'
        }).then(res => {
            console.log(res);
            setUser(res.data.data)
            setIsLoggedIn(true);
            setIsAuthenticated(true);
        }).catch(err => {
            console.log(err);
            setUser(null)
            setIsLoggedIn(false);
        }).finally(()=>{
            setIsLoading(false)
        })
    },[])
    useEffect(() => {
       checkAuth();
    }, [checkAuth]);
    return (
        <AuthContext.Provider value={{user,isLoading,isLoggedIn,checkAuth}}>
            {children}
        </AuthContext.Provider>
    );

};
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
export default AuthProvider;