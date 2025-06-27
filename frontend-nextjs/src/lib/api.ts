const SPRING_API_URL = process.env.NEXT_PUBLIC_SPRING_API_URL;
const FASTAPI_API_URL = process.env.NEXT_PUBLIC_FASTAPI_API_URL;

// 공통 에러 처리 및 JSON 파싱 로직
async function handleResponse(response: Response) {
    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }
    return response.json();
}

/**
 * Spring Boot 백엔드용 fetcher
 */
export const springFetcher = async (path: string, options?: RequestInit) => {
    const url = `${SPRING_API_URL}${path}`;
    const response = await fetch(url, options);
    return handleResponse(response);
};

/**
 * FastAPI 백엔드용 fetcher
 */
export const fastApiFetcher = async (path: string, options?: RequestInit) => {
    const url = `${FASTAPI_API_URL}${path}`;
    const response = await fetch(url, options);
    return handleResponse(response);
};
