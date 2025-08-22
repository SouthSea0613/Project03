// 브라우저 환경 체크
export const isBrowser = typeof window !== 'undefined';

// 안전한 alert 함수
export const safeAlert = (message: string) => {
    if (isBrowser) {
        alert(message);
    }
};

// 토큰에서 Bearer 제거
export const extractTokenFromHeader = (header: string | null): string | null => {
    return header?.replace('Bearer ', '') || null;
};

// 쿠키 관련 유틸리티
export const clearAuthCookies = () => {
    if (isBrowser) {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
};
