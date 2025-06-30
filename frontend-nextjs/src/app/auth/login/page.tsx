'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || '로그인 실패');
            }

            const token = response.headers.get('Authorization');
            if (token) {
                localStorage.setItem('jwt', token);
                router.push('/');
            } else {
                throw new Error('토큰을 받지 못했습니다.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
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