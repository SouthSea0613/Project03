'use client'

import { useState } from "react";
import { springFetcher } from '@/lib/api';
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [checkpassword, setCheckpassword] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [postcode, setPostcode] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [detail_address, setDetailaddress] = useState<string>('')
    const [iderror, setIderror] = useState<string | null>(null);
    const [emailerror, setEmailerror] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== checkpassword) {
            setPasswordError("비밀번호가 일치하지 않습니다.");
            return;
        }
        setPasswordError(null);

        springFetcher('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                name,
                email,
                postcode,
                address,
                detail_address,
            })
        }).then(res => {
            alert('회원가입 성공! 로그인 페이지로 이동합니다.');
            router.push('/auth/login');
        })
            .catch(err => {
                alert('회원가입 중 오류가 발생했습니다.');
            })
    }

    const checkUsername = () => {
        springFetcher('/api/auth/checkUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
            })
        }).then(res => {
            const isAvailable = res.data.success;
            setIderror(isAvailable ? "사용 가능한 아이디입니다." : "이미 사용중인 아이디입니다.");
        }).catch(err => {
            setIderror("아이디 중복 확인 중 오류가 발생했습니다.");
        })
    }

    const checkEmail = () => {
        springFetcher('/api/auth/checkEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
            })
        }).then(res => {
            const isAvailable = res.data.success;
            setEmailerror(isAvailable ? "사용 가능한 이메일입니다." : "이미 사용중인 이메일입니다.");
        })
            .catch(err => {
                setEmailerror("이메일 중복 확인 중 오류가 발생했습니다.");
            })
    }

    return (
        <section className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
            <div className="max-w-md w-full mx-auto bg-gray-800 p-8 rounded-lg border border-border">
                <h1 className="text-3xl font-bold text-text-main text-center mb-6">회원가입</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input type="text" placeholder="아이디" onBlur={checkUsername} onChange={(e) => setUsername(e.target.value)} className="bg-gray-700 text-text-main w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                        {iderror && <p className={`text-sm mt-2 ${iderror.includes("사용 가능한") ? 'text-green-500' : 'text-red-500'}`}>{iderror}</p>}
                    </div>
                    <div>
                        <input type="password" placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)} className="bg-gray-700 text-text-main w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                        <input type="password" placeholder="비밀번호 확인" onChange={(e) => setCheckpassword(e.target.value)} className="bg-gray-700 text-text-main w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                        {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                    </div>
                    <div>
                        <input type="text" placeholder="이름" onChange={(e) => setName(e.target.value)} className="bg-gray-700 text-text-main w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                        <input type="email" placeholder="이메일" onBlur={checkEmail} onChange={(e) => setEmail(e.target.value)} className="bg-gray-700 text-text-main w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                        {emailerror && <p className={`text-sm mt-2 ${emailerror.includes("사용 가능한") ? 'text-green-500' : 'text-red-500'}`}>{emailerror}</p>}
                    </div>
                    <div className="flex space-x-2">
                        <input type="text" placeholder="우편번호" onChange={(e) => setPostcode(e.target.value)} className="bg-gray-700 text-text-main w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                        <button type="button" /*onClick={handleSearchAddress}*/ className="bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors">주소검색</button>
                    </div>
                    <div>
                        <input type="text" placeholder="주소" onChange={(e) => setAddress(e.target.value)} className="bg-gray-700 text-text-main w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                        <input type="text" placeholder="상세주소" onChange={(e) => setDetailaddress(e.target.value)} className="bg-gray-700 text-text-main w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <button type="submit" className="bg-accent text-white font-semibold w-full px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                            회원가입
                        </button>
                    </div>
                </form>
                <p className="text-center text-text-secondary mt-6">
                    이미 계정이 있으신가요?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline">
                        로그인
                    </Link>
                </p>
            </div>
        </section>
    )
}