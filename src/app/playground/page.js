'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';

const Toast = dynamic(() => import('@/components/Toast'), { ssr: false });

export default function ApiPlayground() {
  const [apiKey, setApiKey] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        Cookies.set('apiKey', apiKey, { secure: true, sameSite: 'strict' });
        
        setToastMessage('Valid API key - /protected can be accessed');
        setToastType('success');
        setShowToast(true);
        
        setTimeout(() => {
          router.push('/protected');
        }, 1500);
      } else {
        setToastMessage('Invalid API key');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Error validating API key');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      {showToast && (
        <Toast 
          message={toastMessage} 
          onClose={() => setShowToast(false)} 
          type={toastType}
        />
      )}
      
      <div className="max-w-xl mx-auto">
        <div className="bg-gray-900 rounded-xl p-8 shadow-2xl border border-gray-800">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">API Playground</h1>
              <p className="text-sm text-gray-400">
                Enter your API key to access the protected endpoints. You can find your API keys in the dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* API Key Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-white placeholder-gray-500 transition-colors
                    hover:border-gray-600"
                  placeholder="sk_..."
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  ℹ️ Your API key can be found in the API Keys section of your dashboard.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 text-sm font-medium text-white 
                  bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                  focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Validating...' : 'Validate API Key'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 