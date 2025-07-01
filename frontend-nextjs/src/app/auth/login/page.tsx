'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SPRING_API_URL}/api/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                }
            );

            if (!response.ok) {
                throw new Error('로그인 요청에 실패했습니다.');
            }

            const token = await response.text();

            if (token) {
                Cookies.set('jwt', token, { path: '/' });
                alert("로그인 성공!");
                router.push("/");
            }
        } catch (err) {
            console.error("로그인 실패:", error);
            alert("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");
        }
    };

    return (
        <div style={{ maxWidth: '300px', margin: 'auto', padding: '20px' }}>
            <h1>로그인</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Username
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Password
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}/>
                    </label>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none' }}>
                    로그인
                </button>
            </form>
        </div>
    );
}