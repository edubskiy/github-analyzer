'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProtected() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const apiKey = localStorage.getItem('apiKey');
    
    if (!apiKey) {
      router.push('/playground');
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-900 rounded-xl p-8 shadow-2xl border border-gray-800">
          <h1 className="text-2xl font-bold text-white mb-4">
            Hello World
          </h1>
          <p className="text-gray-400">
            This is a protected route that can only be accessed with a valid API key.
          </p>
        </div>
      </div>
    </div>
  );
} 