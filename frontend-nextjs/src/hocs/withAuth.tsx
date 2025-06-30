'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
    const AuthComponent = (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const token = Cookies.get('jwt');
            if (!token) {
                router.replace('/auth/login');
            }
        }, [router]);

        const token = Cookies.get('jwt');
        if (!token) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
    return AuthComponent;
};

export default withAuth;