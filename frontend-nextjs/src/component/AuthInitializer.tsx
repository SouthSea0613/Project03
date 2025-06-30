'use client'

import Link from "next/link";
import {useEffect, useState} from "react";
import {springFetcher} from "@/lib/api";
export default function AuthInitializer() {
    const [isLoggedIn,setIsLoggedIn] = useState(false)
    const [user,setUser] = useState(null)
    const [isLoading,setIsLoading] = useState(true)
    useEffect(() => {
        const checkLogin = () =>{
            const token = localStorage.getItem('token')
            if(token==null){
                setIsLoading(false)
                return;
            }
            springFetcher('/api/verify',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                console.log(res);
                setIsLoggedIn(true);
            }).catch(err => {
                console.log(err);
                setIsLoggedIn(false);
            })
        }
        checkLogin();
    },[setIsLoggedIn,setUser])
    return isLoading ? <div>loading...</div> : null;
}