import { useState, useEffect, useRef } from 'react';
const useIdleTimeout = (onIdle: () => void, idleTimeInSeconds: number) => {
    const timeoutId = useRef<number | null>(null);

    const resetTimer = () => {
        if (timeoutId.current) {
            window.clearTimeout(timeoutId.current);
        }

        timeoutId.current = window.setTimeout(onIdle, idleTimeInSeconds * 1000);
    };

    const handleUserActivity = () => {
        resetTimer();
    };

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
    }, []);

    return null;
};

export default useIdleTimeout;