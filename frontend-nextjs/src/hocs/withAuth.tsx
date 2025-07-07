import { useRouter } from 'next/router';
import { useEffect, ComponentType } from 'react';
import { useAuth } from '../context/AuthContext';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const ComponentWithAuth = (props: P) => {
        const { isAuthenticated, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            // 로딩이 끝나고, 인증되지 않았다면 로그인 페이지로 리다이렉트
            if (!isLoading && !isAuthenticated) {
                router.replace('/login');
            }
        }, [isAuthenticated, isLoading, router]);

        // 로딩 중이거나 인증되지 않았다면 로딩 스피너 등을 보여줌 (컨텐츠 노출 방지)
        if (isLoading || !isAuthenticated) {
            return <div>Loading...</div>; // 또는 스켈레톤 UI, 스피너 등
        }

        // 인증되었다면 원래 컴포넌트를 렌더링
        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuth;
};

export default withAuth;