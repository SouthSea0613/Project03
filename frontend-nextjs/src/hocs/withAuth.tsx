'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {springFetcher} from "@/lib/api";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
    return (props: any) => {
        const [isLoggedIn,setIsLoggedIn] = useState(false)
        const [user,setUser] = useState(null)
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [isLoading,setIsLoading] = useState(true)
        const router = useRouter();

        useEffect(() => {
                springFetcher('/api/auth/user/me',{
                    method: 'GET',
                    credentials:'include'
                }).then(res => {
                    console.log(res);
                    setUser(res.data)
                    setIsLoggedIn(true);
                    setIsAuthenticated(true);
                }).catch(err => {
                    console.log(err);
                    setUser(null)
                    setIsLoggedIn(false);
                })
            setIsLoading(false);
        }, [router]);
        if (isLoading) {
            return <div>로딩 중...</div>;
        }

        if (isAuthenticated) {
            return <WrappedComponent {...props} user={user} isLoggedIn={isLoggedIn} />;
        }

        return null;
    };
};

export default withAuth;