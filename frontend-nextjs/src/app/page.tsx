'use client';

import { useState, useEffect } from 'react';
import { springFetcher, fastApiFetcher } from '@/lib/api';

export default function Home() {
    const [springMessage, setSpringMessage] = useState('Spring Boot 메시지 로딩 중...');
    const [fastApiMessage, setFastApiMessage] = useState('FastAPI 메시지 로딩 중...');

    useEffect(() => {
        // Spring Boot API 호출
        springFetcher('/api/test')
            .then((data) => {
                setSpringMessage(data.message);
            })
            .catch((error) => {
                console.error('Error fetching from Spring Boot:', error);
                setSpringMessage('Spring Boot 데이터를 불러오는 데 실패했습니다.');
            });

        // FastAPI API 호출
        fastApiFetcher('/api/test')
            .then((data) => {
                setFastApiMessage(data.message);
            })
            .catch((error) => {
                console.error('Error fetching from FastAPI:', error);
                setFastApiMessage('FastAPI 데이터를 불러오는 데 실패했습니다.');
            });
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
            <div className="text-center">
                <p className="text-lg font-semibold text-gray-400">From Spring Boot:</p>
                <p className="text-2xl">{springMessage}</p>
            </div>
            <div className="text-center">
                <p className="text-lg font-semibold text-gray-400">From FastAPI:</p>
                <p className="text-2xl">{fastApiMessage}</p>
            </div>
        </main>
    );
}