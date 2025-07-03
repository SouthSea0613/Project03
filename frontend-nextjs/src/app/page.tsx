'use client';

import {useAuth} from "@/context/AuthContext";
import {useEffect} from "react";
import {router} from "next/client";

function Home() {
    const { user } = useAuth();
    const { isLoading, isLoggedIn, checkAuth } = useAuth();
    useEffect(() => {
        // ⭐️ 2. 로딩 중일 때는 아무것도 하지 않고 기다립니다.
        if (isLoading) {
            return;
        }

        // 3. 로딩이 끝났는데, 로그인이 안 되어 있을 때만 리다이렉트합니다.
        if (!isLoggedIn) {
            router.replace('/auth/login');
        }

    }, [isLoading, isLoggedIn, router]); // ⭐️ 의존성 배열에 isLoading 추가

    // 4. 로딩 중이거나, (로딩이 끝났지만) 아직 인증되지 않았다면 로딩 화면을 보여줍니다.
    if (isLoading || !isLoggedIn) {
        return <div>Loading...</div>;
    }
    return (
        <main style={{ padding: '20px' }}>
            { user ? (
                    <h1>환영합니다, {user.username}님!</h1>
            ):(
                <p>데이터 없음</p>
            )}

        </main>
    );
}

export default Home;