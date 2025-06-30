'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import withAuth from '../hocs/withAuth';

interface UserProfile {
    name: string;
    email: string;
}

function Home() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = Cookies.get('jwt');
            if (!token) {
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SPRING_API_URL}/api/user/me`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('프로필 정보를 가져오는데 실패했습니다.');
                }

                const profileData: UserProfile = await response.json();
                setUserProfile(profileData);

            } catch (error) {
                console.error(error);
                Cookies.remove('jwt');
                router.replace('/auth/login');
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        router.push('/login');
    };
    
    if (!userProfile) {
        return null;
    }

    return (
        <main style={{ padding: '20px' }}>
            <h1>환영합니다, {userProfile.name}님!</h1>
            <p>이메일: {userProfile.email}</p>
            <button onClick={handleLogout} style={{ marginTop: '20px' }}>
                로그아웃
            </button>
        </main>
    );
}

export default withAuth(Home);