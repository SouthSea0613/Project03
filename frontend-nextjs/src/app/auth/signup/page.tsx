'use client'

import {useState} from "react";
import { springFetcher, fastApiFetcher } from '@/lib/api';

export default function Signup() {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [checkpassword,setCheckpassword] = useState('')
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [postcode,setPostcode] = useState('')
    const [address,setAddress] = useState('')
    const [detail_address,setDetailaddress] = useState('')

    const SignupSubmit = () => {
        springFetcher('/api/signup',{
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
            location.href = '/auth/login'
        })
            .catch(err => {
                console.log(err)
                console.log("연결안됐어")
            })
    }
    const checkUsername = () => {
        springFetcher('/api/checkusername',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
            })
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err )
        })
    }
    return (
        <section>
            <input type="text" placeholder="아이디" onChange={(e) => setUsername(e.target.value)}/>
            <input type="button" placeholder="중복확인" onClick={checkUsername}/>
            <input type="password" placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)}/>
            <input type="password" placeholder="비밀번호를 다시 입력해주세요" onChange={(e) => setCheckpassword(e.target.value)}/>
            <input type="text" placeholder="이름을 입력해주세요" onChange={(e) => setName(e.target.value)}/>
            <input type="text" placeholder="이메일 주소" onChange={(e) => setEmail(e.target.value)}/>
            <input type="text" placeholder="우편번호" onChange={(e) => setPostcode(e.target.value)}/>
            <input type="text" placeholder="주소" onChange={(e) => setAddress(e.target.value)}/>
            <input type="text" placeholder="상세주소" onChange={(e) => setDetailaddress(e.target.value)}/>
            <button onClick={SignupSubmit}>회원가입</button>
        </section>
    )
}
