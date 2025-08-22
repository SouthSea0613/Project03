import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { useAuth } from '@/context/AuthContext';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const ComponentWithAuth = (props: P) => {
        const { user, isAuthenticated, isLoading } = useAuth();
        const router = useRouter();
        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.replace('/auth/login');
            }
        }, [user, isAuthenticated, isLoading, router]);

        if (isLoading || !isAuthenticated) {
            return <div>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuth;
};

export default withAuth;