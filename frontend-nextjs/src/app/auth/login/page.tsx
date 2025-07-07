'use client'
import {useState} from "react";
import {springFetcher} from "@/lib/api";
import {useRouter} from "next/navigation";
import { usePathname } from 'next/navigation';
import {useAuth} from "@/context/AuthContext";

export default function LoginPage() {
    const { setAccessToken } = useAuth();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const router = useRouter();
    const url = usePathname();
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
                    const {accessToken} = res.data.data;
                    setAccessToken(accessToken);
                    alert("로그인 성공!");
                    router.push("/");
                }
            })
            .catch(err => {
                console.error("로그인 실패:", err);
                alert("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");
            })
    }
    return (
        <section>
            <input type="text" placeholder="아이디" onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)}/>
            <input type="button" onClick={handleSubmit} value="로그인"/>
        </section>
    )
}