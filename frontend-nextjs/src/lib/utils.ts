export const isBrowser = typeof window !== 'undefined';

export const safeAlert = (message: string) => {
    if (isBrowser) {
        alert(message);
    }
};

export const extractTokenFromHeader = (header: string | null): string | null => {
    return header?.replace('Bearer ', '') || null;
};

export const clearAuthCookies = () => {
    if (isBrowser) {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
};
