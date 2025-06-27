const SPRING_API_URL = process.env.NEXT_PUBLIC_SPRING_API_URL;
const FASTAPI_API_URL = process.env.NEXT_PUBLIC_FASTAPI_API_URL;

async function handleResponse(response: Response) {
    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }
    return response.json();
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
