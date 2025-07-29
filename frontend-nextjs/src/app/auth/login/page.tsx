'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {springFetcher} from "@/lib/api";
import Link from "next/link";

export default function LoginPage() {
    const { checkAuth, setAccessToken } = useAuth();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        springFetcher('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
            credentials: 'include',
        })
            .then(res => {
                if(res.data.success){
                    setAccessToken(res.data.data);
                    checkAuth();
                    alert(res.data.message);
                    router.push("/");
                }else{
                    alert(res.data.message);
                    router.push("/auth/login");
                }
            })
            .catch(err => {
                alert("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");
            });
    }

    return (
        <section className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
            <div className="max-w-md w-full mx-auto bg-gray-800 p-8 rounded-lg border border-border">
                <h1 className="text-3xl font-bold text-text-main text-center mb-6">로그인</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="아이디"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-gray-700 text-text-main w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-700 text-text-main w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="bg-accent text-white font-semibold w-full px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            로그인
                        </button>
                    </div>
                </form>
                <p className="text-center text-text-secondary mt-6">
                    계정이 없으신가요?{" "}
                    <Link href="/auth/signup" className="text-primary hover:underline">
                        회원가입
                    </Link>
                </p>
            </div>
        </section>
    );
}