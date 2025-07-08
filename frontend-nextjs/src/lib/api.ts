const SPRING_API_URL = process.env.NEXT_PUBLIC_SPRING_API_URL;
const FASTAPI_API_URL = process.env.NEXT_PUBLIC_FASTAPI_API_URL;

async function handleResponse(response: Response) {
    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }

    // JSON 데이터와 헤더를 모두 포함한 객체를 반환하도록 수정
    const data = await response.json();
    return {
        data: data,
        headers: response.headers, // 헤더 정보 추가
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
    // 1. 헤더에 Access Token 추가
    const accessToken = localStorage.getItem('accessToken');
    const headers = new Headers(options.headers);
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }
    options.headers = headers;

    const fetcher = apiType === 'spring' ? springFetcher : fastApiFetcher;

    try {
        // 2. 일단 API 요청 시도
        return await fetcher(path, options);
    } catch (error: any) {
        // 3. 401 에러 발생 시 토큰 재발급 시도
        if (error.status === 401) {
            console.log('Access Token is expired. Trying to refresh...');
            try {
                // Refresh Token으로 새로운 Access Token 요청
                // (이 요청은 authFetcher를 사용하면 무한 루프에 빠질 수 있으므로, 기본 fetcher 사용)
                const refreshResponse = await springFetcher('/api/token/reissue', {
                    method: 'POST',
                    credentials: 'include', // HttpOnly 쿠키 전송을 위해 필수
                });

                const newAccessToken = refreshResponse.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);
                console.log('Access Token refreshed successfully.');

                // 새로운 토큰으로 원래 요청 헤더를 교체
                headers.set('Authorization', `Bearer ${newAccessToken}`);
                options.headers = headers;

                // 4. 원래 요청 재시도
                console.log('Retrying the original request...');
                return await fetcher(path, options);

            } catch (refreshError) {
                // Refresh Token도 만료된 경우
                console.error("Refresh token is invalid. Logging out.");
                localStorage.removeItem('accessToken');
                // 필요하다면 로그인 페이지로 리디렉션
                // window.location.href = '/login';
                throw refreshError; // 최종적으로는 실패 처리
            }
        }
        // 401 에러가 아닌 다른 에러는 그대로 throw
        throw error;
    }
};