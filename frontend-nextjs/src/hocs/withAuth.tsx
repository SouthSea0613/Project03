'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
    return (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const token = Cookies.get('token');
            if (!token) {
                router.replace('/auth/login');
            }
        }, [router]);

        const token = Cookies.get('token');
        if (!token) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;