'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import withAuth from '../hocs/withAuth';

interface UserProfile {
    name: string;
    email: string;
}

function Home({ user }: { user: { username: string, email: string } }) {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const router = useRouter();

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         const token = Cookies.get('token');
    //         if (!token) {
    //             return;
    //         }
    //
    //         try {
    //             const response = await fetch(
    //                 `${process.env.NEXT_PUBLIC_SPRING_API_URL}/api/auth/user/me`,
    //                 {
    //                     method: 'POST',
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }
    //             );
    //
    //             if (!response.ok) {
    //                 throw new Error('프로필 정보를 가져오는데 실패했습니다.');
    //             }
    //
    //             const profileData: UserProfile = await response.json();
    //             setUserProfile(profileData);
    //
    //         } catch (error) {
    //             console.error(error);
    //             // Cookies.remove('jwt');
    //             // router.replace('/auth/login');
    //         }
    //     };
    //
    //     fetchProfile();
    // }, [router]);

    // const handleLogout = () => {
    //     router.push('/auth/login');
    // };
    //
    // if (!userProfile) {
    //     return null;
    // }

    return (
        <main style={{ padding: '20px' }}>
            { user ? (
                    <h1>환영합니다, {user.username}님!</h1>
            ):(
                <p>데이터 없음</p>
            )}

        </main>
    );
}

export default withAuth(Home);
// export default Home;