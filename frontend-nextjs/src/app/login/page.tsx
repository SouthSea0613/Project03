'use client'

import {useState} from "react";
import {springFetcher} from "@/lib/api";

export default function LoginPage() {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')

    const LoginSubmit = () => {
        springFetcher('/api/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            })
        }).then(res => {
            console.log(res)
            alert("로그인 성공")
        }).catch(err => {
            console.log(err )
            alert("로그인 실패")
        })
    }
    return(
        <section>
            <input type="text" placeholder="아이디" onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)}/>
            <input type="button" onClick={LoginSubmit} value="로그인"/>
        </section>
    )
}