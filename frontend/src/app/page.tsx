'use client';

import { useState, useEffect } from 'react';
import { fetcher } from "@/lib/api";

export default function Home() {
  const [message, setMessage] = useState('메시지를 불러오는 중...');

  useEffect(() => {
      fetcher('/api/hello')
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