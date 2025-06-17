const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * API 요청을 처리하는 중앙 fetcher 함수
 * @param path API 경로 (예: /api/hello)
 * @param options fetch에 전달할 추가 옵션 (method, headers, body 등)
 */
export const fetcher = async (path: string, options?: RequestInit) => {
    const url = `${API_URL}${path}`;
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }

    return response.json();
};