'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useApiKeys } from '@/hooks/useApiKeys';
import CurrentPlan from '@/components/dashboard/CurrentPlan';
import ApiKeysTable from '@/components/dashboard/ApiKeysTable';

const Toast = dynamic(() => import('@/components/Toast'), { ssr: false });
const EditKeyModal = dynamic(() => import('@/components/EditKeyModal'), { ssr: false });

export default function ApiKeysDashboard() {
  const { 
    apiKeys, 
    isLoading, 
    fetchApiKeys, 
    createApiKey, 
    deleteApiKey, 
    updateApiKey 
  } = useApiKeys();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('1000');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [editingKey, setEditingKey] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const showToastMessage = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      await createApiKey(newKeyName, monthlyLimit);
      setIsModalOpen(false);
      setNewKeyName('');
      setMonthlyLimit('1000');
      showToastMessage('API key created successfully!');
    } catch (error) {
      showToastMessage('Failed to create API key', 'error');
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      try {
        await deleteApiKey(keyId);
        showToastMessage('API key deleted successfully!', 'success');
      } catch (error) {
        showToastMessage('Failed to delete API key', 'error');
      }
    }
  };

  const handleToggleVisibility = async (keyId) => {
    try {
      const keyToUpdate = apiKeys.find(key => key.id === keyId);
      await updateApiKey(keyId, { is_visible: !keyToUpdate.is_visible });
    } catch (error) {
      showToastMessage('Failed to toggle visibility', 'error');
    }
  };

  const handleCopyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      showToastMessage('API key copied to clipboard!');
    } catch (error) {
      showToastMessage('Failed to copy API key', 'error');
    }
  };

  const handleEditKey = async (updatedKey) => {
    try {
      await updateApiKey(updatedKey.id, {
        name: updatedKey.name,
        monthly_limit: updatedKey.monthly_limit
      });
      setEditingKey(null);
      showToastMessage('API key updated successfully!');
    } catch (error) {
      showToastMessage('Failed to update API key', 'error');
    }
  };

  if (typeof window === 'undefined') return null;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8 flex items-center justify-center">
        Loading...
      </div>
    );
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
      
      {editingKey && (
        <EditKeyModal
          keyData={editingKey}
          onClose={() => setEditingKey(null)}
          onSave={handleEditKey}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md shadow-2xl border border-gray-800">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Create a New API Key</h2>
                <p className="text-sm text-gray-400">
                  Enter a name and monthly usage limit for your new API key.
                </p>
              </div>

              <form onSubmit={handleCreateKey} className="space-y-6">
                {/* Key Name Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-white placeholder-gray-500 transition-colors
                      hover:border-gray-600"
                    placeholder="e.g., Production API Key"
                    required
                  />
                </div>

                {/* Monthly Limit Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Monthly Usage Limit
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={monthlyLimit}
                      onChange={(e) => setMonthlyLimit(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        text-white placeholder-gray-500 transition-colors
                        hover:border-gray-600"
                      required
                      min="1"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">requests</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ℹ️ The combined usage of all your keys cannot exceed your plan&apos;s limit.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-400 
                      hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white 
                      bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors
                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                      focus:ring-offset-gray-900"
                  >
                    Create Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <CurrentPlan />

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">API Keys</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              +
            </button>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
          </div>
          
          <ApiKeysTable 
            apiKeys={apiKeys}
            onToggleVisibility={handleToggleVisibility}
            onEdit={setEditingKey}
            onCopy={handleCopyKey}
            onDelete={handleDeleteKey}
          />
        </div>

        {/* Create API Key Modal and other sections remain the same */}
      </div>
    </div>
  );
}
