'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('메시지를 불러오는 중...');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hello`) // Proxy 설정으로 인해 localhost:8080/api/hello로 요청됨
        .then((res) => res.json())
        .then((data) => {
          setMessage(data.message);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setMessage('데이터를 불러오는 데 실패했습니다.');
        });
  }, []);

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
              <p className="text-2xl">{message}</p>
          </div>
      </main>
  );
}