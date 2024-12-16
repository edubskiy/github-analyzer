'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import Toast from '@/components/Toast';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

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
        // Store API key in both localStorage and cookie
        localStorage.setItem('apiKey', apiKey);
        Cookies.set('apiKey', apiKey, { secure: true, sameSite: 'strict' });
        
        // Show success message
        setToastMessage('Valid API key - /protected can be accessed');
        setToastType('success');
        setShowToast(true);
        
        // Add console.log to debug
        console.log('Will redirect to protected page in 2 seconds...');
        
        // Delay redirect to show the toast
        setTimeout(() => {
          console.log('Redirecting now...');
          window.location.replace('/protected');
        }, 2000);
      } else {
        setToastMessage('Invalid API key');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error during validation:', error);
      setToastMessage('Error validating API key');
      setToastType('error');
      setShowToast(true);
    }
  };

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