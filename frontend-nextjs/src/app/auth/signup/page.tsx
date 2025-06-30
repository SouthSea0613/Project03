'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { springFetcher } from '@/lib/api';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        postcode: '',
        address: '',
        detailAddress: '',
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await springFetcher('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            alert('회원가입 성공! 로그인 페이지로 이동합니다.');
            router.push('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h1>회원가입</h1>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div key={key} style={{ marginBottom: '10px' }}>
                        <label>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                            <input
                                type={key === 'password' ? 'password' : 'text'}
                                name={key}
                                value={formData[key as keyof typeof formData]}
                                onChange={handleChange}
                                required={key !== 'detailAddress'}
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </label>
                    </div>
                ))}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none' }}>
                    가입하기
                </button>
            </form>
        </div>
    );
}