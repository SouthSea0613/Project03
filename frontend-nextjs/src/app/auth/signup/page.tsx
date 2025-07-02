'use client'

import {useState} from "react";
import { springFetcher, fastApiFetcher } from '@/lib/api';
import {useRouter} from "next/navigation";

export default function Signup() {
    const [username,setUsername] = useState<string | null>('')
    const [password,setPassword] = useState<string | null>('')
    const [checkpassword,setCheckpassword] = useState<string | null>('')
    const [name,setName] = useState<string | null>('')
    const [email,setEmail] = useState<string | null>('')
    const [postcode,setPostcode] = useState<string | null>('')
    const [address,setAddress] = useState<string | null>('')
    const [detail_address,setDetailaddress] = useState<string | null>('')
    const [iderror, setIderror] = useState<string | null>('');
    const [emailerror, setEmailerror] = useState<string | null>('');
    let isCheckusername = false;
    let isCheckemail = false;
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        springFetcher('/api/auth/signup',{
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
            console.log(res)
            console.log("연결됐당")
            alert('회원가입 성공! 로그인 페이지로 이동합니다.');
            router.push('/auth/login');
        })
            .catch(err => {
                console.log(err)
                console.log("연결안됐어")
                // setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
            })
    }
    const checkUsername = () => {
        springFetcher('/api/auth/checkUsername',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
            })
        }).then(res => {
            console.log(res)
            if(res.data){
                isCheckusername = true;
                setIderror(res.data.message);
            }else{
                isCheckusername = false;
                setIderror(res.data.message);
            }

        }).catch(err => {
            console.log(err )
        })
    }
    const checkEmail = () =>{
        springFetcher('/api/auth/checkEmail',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
            })
        }).then(res => {
            console.log(res)
            if(res.data){
                isCheckemail = true;
                setEmailerror(res.data.message);
            }else{
                isCheckemail = false;
                setEmailerror(res.data.message)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    return (
        <section>
            <input type="text" placeholder="아이디" onBlur={checkUsername} onChange={(e) => setUsername(e.target.value)}/>
            {iderror && <p>{iderror}</p>}
            <input type="password" placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)}/>
            <input type="password" placeholder="비밀번호를 다시 입력해주세요" onChange={(e) => setCheckpassword(e.target.value)}/>
            <input type="text" placeholder="이름을 입력해주세요" onChange={(e) => setName(e.target.value)}/>
            <input type="text" placeholder="이메일 주소" onBlur={checkEmail} onChange={(e) => setEmail(e.target.value)}/>
            {emailerror && <p>{emailerror}</p>}
            <input type="text" placeholder="우편번호" onChange={(e) => setPostcode(e.target.value)}/>
            <input type="text" placeholder="주소" onChange={(e) => setAddress(e.target.value)}/>
            <input type="text" placeholder="상세주소" onChange={(e) => setDetailaddress(e.target.value)}/>
            <button onClick={handleSubmit}>회원가입</button>
        </section>
    )
}
