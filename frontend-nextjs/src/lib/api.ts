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
