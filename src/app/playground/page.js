'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (data.valid) {
        setToastMessage('Valid API key - /protected can be accessed');
        setToastType('success');
        setShowToast(true);
        router.push('/protected');
      } else {
        setToastMessage('Invalid API key');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Error validating API key');
      setToastType('error');
      setShowToast(true);
    }
  };

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      {showToast && (
        <Toast 
          message={toastMessage} 
          onClose={() => setShowToast(false)} 
          type={toastType}
        />
      )}
      
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          API Playground
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 
                rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="sk_..."
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium 
              py-2 px-4 rounded-md transition-colors"
          >
            Validate API Key
          </button>
        </form>
      </div>
    </div>
  );
} 