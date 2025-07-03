'use client';

import {useAuth} from "@/context/AuthContext";

function Home() {
    const { user } = useAuth();
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