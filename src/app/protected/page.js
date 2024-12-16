'use client';
import dynamic from 'next/dynamic';

const Toast = dynamic(() => import('@/components/Toast'), { ssr: false });

export default function ProtectedPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-gray-900 rounded-xl p-8 shadow-2xl border border-gray-800">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-4">Protected Endpoint</h1>
              <div className="p-4 bg-green-900/30 border border-green-800 rounded-lg">
                <p className="text-green-400">
                  ✓ This endpoint is accessible only with a valid API key
                </p>
              </div>
            </div>
            
            <div className="text-gray-400 space-y-4">
              <p>
                You have successfully accessed this protected endpoint using your API key.
                This confirms that your API key is valid and working correctly.
              </p>
              <p className="text-sm text-gray-500">
                You can use this same API key to make requests to our API endpoints.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 