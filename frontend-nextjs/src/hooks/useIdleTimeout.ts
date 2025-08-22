import { useEffect, useRef, useCallback } from 'react';

const useIdleTimeout = (onIdle: () => void, idleTimeInSeconds: number) => {
    const timeoutId = useRef<number | null>(null);

    const resetTimer = useCallback(() => {
        if (timeoutId.current) {
            window.clearTimeout(timeoutId.current);
        }

        timeoutId.current = window.setTimeout(onIdle, idleTimeInSeconds * 1000);
    }, [onIdle, idleTimeInSeconds]);

    const handleUserActivity = useCallback(() => {
        resetTimer();
    }, [resetTimer]);

    useEffect(() => {
        resetTimer();

        const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
        
        events.forEach(event => window.addEventListener(event, handleUserActivity));

        return () => {
            events.forEach(event => window.removeEventListener(event, handleUserActivity));
            
            if (timeoutId.current) {
                window.clearTimeout(timeoutId.current);
            }
        };
    }, [handleUserActivity, resetTimer]);

    return null;
};

export default useIdleTimeout;