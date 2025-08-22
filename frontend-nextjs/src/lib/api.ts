import Cookies from "js-cookie";

const SPRING_API_URL = process.env.NEXT_PUBLIC_SPRING_API_URL || 'http://localhost:8080';
const FASTAPI_API_URL = process.env.NEXT_PUBLIC_FASTAPI_API_URL || 'http://localhost:8000';

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = new Error(`API call failed with status: ${response.status}`);
        (error as any).status = response.status;
        throw error;
    }

    const data = await response.json();
    return {
        data: data,
        headers: response.headers,
    };
}

export const springFetcher = async (path: string, options?: RequestInit) => {
    const url = `${SPRING_API_URL}${path}`;
    const response = await fetch(url, options);
    return handleResponse(response);
};

export const fastApiFetcher = async (path: string, options?: RequestInit) => {
    const url = `${FASTAPI_API_URL}${path}`;
    const response = await fetch(url, options);
    return handleResponse(response);
};

type ApiType = 'spring' | 'fastapi';

export const authFetcher = async (path: string, options: RequestInit = {}, apiType: ApiType) => {
    const accessToken = Cookies.get('accessToken');
    const headers = new Headers(options.headers);
    
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }
    options.headers = headers;

    const fetcher = apiType === 'spring' ? springFetcher : fastApiFetcher;

    try {
        return await fetcher(path, options);
    } catch (error: unknown) {
        const err = error as { status?: number };
        
        if (err.status === 401) {
            try {
                const refreshResponse = await springFetcher('/api/auth/refresh', {
                    method: 'POST',
                    credentials: 'include',
                });

                if (refreshResponse.data.success) {
                    // 새로운 accessToken을 쿠키에 저장
                    const newAccessToken = refreshResponse.data.data;
                    
                    // 서버에서 쿠키로 설정하므로 클라이언트에서는 별도 저장 불필요
                    // Cookies.set('accessToken', newAccessToken, { 
                    //     expires: 1/48, 
                    //     secure: true, 
                    //     sameSite: 'strict' 
                    // });

                    headers.set('Authorization', `Bearer ${newAccessToken}`);
                    options.headers = headers;

                    return await fetcher(path, options);
                } else {
                    // 리프레시 토큰도 만료된 경우
                    Cookies.remove('accessToken');
                    Cookies.remove('refreshToken');
                    window.location.href = '/auth/login';
                    throw new Error('Session expired');
                }
            } catch (refreshError) {
                // 리프레시 실패 시 로그인 페이지로 리다이렉트
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                window.location.href = '/auth/login';
                throw refreshError;
            }
        }
        throw error;
    }
};