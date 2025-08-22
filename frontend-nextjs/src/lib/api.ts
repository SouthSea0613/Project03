import Cookies from "js-cookie";

const SPRING_API_URL = process.env.NEXT_PUBLIC_SPRING_API_URL || "http://localhost:8080";
const FASTAPI_API_URL = process.env.NEXT_PUBLIC_FASTAPI_API_URL || "http://localhost:8000";

async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed with status: ${response.status}, message: ${errorText}`);
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
    } catch (error: any) {
        if (error.message.includes('401')) {
            try {
                const refreshResponse = await springFetcher('/api/auth/refresh', {
                    method: 'POST',
                    credentials: 'include',
                });
                
                const newAccessToken = refreshResponse.headers.get('Authorization')?.replace('Bearer ', '');
                if (newAccessToken) {
                    Cookies.set('accessToken', newAccessToken, { expires: 1/48 });
                    headers.set('Authorization', `Bearer ${newAccessToken}`);
                    options.headers = headers;
                    return await fetcher(path, options);
                }
            } catch (refreshError) {
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
                throw refreshError;
            }
        }
        throw error;
    }
};