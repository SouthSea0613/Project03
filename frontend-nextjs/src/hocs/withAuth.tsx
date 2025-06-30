// src/hocs/withAuth.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ComponentType을 import 해야 합니다.
import type { ComponentType } from 'react';

// 감쌀 컴포넌트의 props 타입을 정의합니다. 어떤 props도 받을 수 있도록 제네릭을 사용합니다.
export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {

    const ComponentWithAuth = (props: P) => {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            // localStorage는 클라이언트 사이드에서만 접근 가능합니다.
            const token = localStorage.getItem('jwt');

            if (!token) {
                router.replace('/login');
            } else {
                // 실제로는 여기서 토큰 유효성 검증 API를 호출하는 것이 더 좋습니다.
                // 이 예시에서는 토큰 존재 유무만 확인합니다.
                setIsAuthenticated(true);
            }
        }, [router]);

        // 인증 확인 중이거나 실패했다면 로딩 또는 null을 반환하여
        // 감싸진 컴포넌트가 렌더링되지 않도록 합니다.
        if (!isAuthenticated) {
            return <div>Loading...</div>; // 또는 로딩 스피너 컴포넌트
        }

        // 인증되었다면 원래 컴포넌트를 렌더링합니다.
        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuth;
}