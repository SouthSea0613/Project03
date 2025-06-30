'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 이 예시에서는 간단히 사용자 정보를 any 타입으로 처리합니다.
// 실제 프로젝트에서는 User 관련 타입을 정의하는 것이 좋습니다.
interface UserProfile {
    name: string;
    email: string;
    // ... 기타 사용자 정보
}

export default function Home() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            router.replace('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                // 백엔드에 사용자 정보를 요청하는 API (예: /api/user/me)
                // 이 API는 ProdSecurityConfig에 따라 USER 또는 ADMIN 역할을 가진 사용자만 접근 가능해야 합니다.
                // 아래 코드는 개념 설명을 위한 예시이며, 실제 '/api/user/me' 엔드포인트를 백엔드에 구현해야 합니다.
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRING_API_URL}/api/user/me`, {
                    headers: {
                        'Authorization': token,
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwt');
                    router.replace('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('프로필 정보를 가져오는 데 실패했습니다.');
                }

                const data: UserProfile = await response.json();
                setUserProfile(data);
            } catch (error) {
                console.error(error);
                localStorage.removeItem('jwt');
                router.replace('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        router.push('/login');
    };

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (!userProfile) {
        return null; // 로딩이 끝났지만 프로필이 없으면 아무것도 렌더링하지 않음 (이미 리디렉션 처리됨)
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

// **참고:** 위 코드가 동작하려면 백엔드에 아래와 같은 컨트롤러가 필요합니다.
/*
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService; // 사용자 정보를 조회하는 서비스

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto.Profile> getMyProfile(Authentication authentication) {
        String username = authentication.getName();
        UserResponseDto.Profile profile = userService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }
}
*/