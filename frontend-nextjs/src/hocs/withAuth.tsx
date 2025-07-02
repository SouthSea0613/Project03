'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
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
                // router.replace('/auth/login');
            setIsLoading(false);
        }, [router]);
        if (isLoading) {
            return <div>로딩 중...</div>; // 또는 스켈레톤 UI
        }

        // 로딩이 끝났고, 인증되었다면 페이지 컴포넌트를 보여줌
        if (isAuthenticated) {
            return <WrappedComponent {...props} user={user} isLoggedIn={isLoggedIn} />;
        }

        // 로딩이 끝났지만, 인증되지 않았다면 아무것도 보여주지 않음 (이미 리다이렉트가 실행됨)
        return null;
    };
};

export default withAuth;