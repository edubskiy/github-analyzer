'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Toast from '@/components/Toast';
import EditKeyModal from '@/components/EditKeyModal';

export default function ApiKeysDashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('1000');
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [editingKey, setEditingKey] = useState(null);

  // Fetch API Keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateApiKey = () => {
    return `sk_${Math.random().toString(36).substr(2, 32)}`;
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      const newKey = {
        name: newKeyName,
        key: generateApiKey(),
        usage: 0,
        monthly_limit: parseInt(monthlyLimit),
        is_visible: false
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select();

      if (error) throw error;

      setApiKeys([data[0], ...apiKeys]);
      setIsModalOpen(false);
      setNewKeyName('');
      setMonthlyLimit('1000');
    } catch (error) {
      console.error('Error creating API key:', error.message);
    }
  };

  const handleDeleteKey = async (keyId) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      setToastMessage('API key deleted successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error deleting API key:', error.message);
      setToastMessage('Failed to delete API key');
      setShowToast(true);
    }
  };

  const handleToggleVisibility = async (keyId) => {
    try {
      const keyToUpdate = apiKeys.find(key => key.id === keyId);
      const { data, error } = await supabase
        .from('api_keys')
        .update({ is_visible: !keyToUpdate.is_visible })
        .eq('id', keyId)
        .select();

      if (error) throw error;

      setApiKeys(apiKeys.map(key => 
        key.id === keyId ? data[0] : key
      ));
    } catch (error) {
      console.error('Error toggling visibility:', error.message);
    }
  };

  // Add copy functionality
  const handleCopyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      setToastMessage('API key copied to clipboard!');
      setShowToast(true);
      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error.message);
      setToastMessage('Failed to copy API key');
      setShowToast(true);
    }
  };

  // Add the edit handler
  const handleEditKey = async (updatedKey) => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update({
          name: updatedKey.name,
          monthly_limit: updatedKey.monthly_limit
        })
        .eq('id', updatedKey.id)
        .select();

      if (error) throw error;

      setApiKeys(apiKeys.map(key => 
        key.id === updatedKey.id ? data[0] : key
      ));
      setEditingKey(null);
      setToastMessage('API key updated successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error updating API key:', error.message);
      setToastMessage('Failed to update API key');
      setShowToast(true);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white dark:bg-gray-900 p-8 flex items-center justify-center">
      Loading...
    </div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      {showToast && (
        <Toast 
          message={toastMessage} 
          onClose={() => setShowToast(false)} 
          type="error"
        />
      )}
      
      {editingKey && (
        <EditKeyModal
          key={editingKey.id}
          keyData={editingKey}
          onClose={() => setEditingKey(null)}
          onSave={handleEditKey}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Pages / Overview
              </div>
              <h1 className="text-2xl font-semibold">Overview</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Operational</span>
              </div>
            </div>
          </div>

          {/* Current Plan Card */}
          <div className="bg-gradient-to-r from-rose-200 via-purple-200 to-blue-200 dark:from-rose-900 dark:via-purple-900 dark:to-blue-900 rounded-xl p-6 mb-8">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">CURRENT PLAN</div>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Researcher</h2>
                <div>
                  <div className="text-sm mb-2">API Limit</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="text-sm mt-1">0/1,000 Requests</div>
                </div>
              </div>
              <button className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg text-sm">
                Manage Plan
              </button>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
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
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-3">NAME</th>
                  <th className="pb-3">USAGE</th>
                  <th className="pb-3">KEY</th>
                  <th className="pb-3">OPTIONS</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b dark:border-gray-700">
                    <td className="py-4">{key.name}</td>
                    <td className="py-4">{key.usage}</td>
                    <td className="py-4 font-mono">
                      {key.is_visible ? key.key : '********************************'}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleToggleVisibility(key.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <span className="sr-only">
                            {key.is_visible ? 'Hide' : 'Show'}
                          </span>
                          {key.is_visible ? '👁️' : '👁️‍🗨️'}
                        </button>
                        <button 
                          onClick={() => setEditingKey(key)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <span className="sr-only">Edit</span>
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleCopyKey(key.key)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <span className="sr-only">Copy</span>
                          📋
                        </button>
                        <button 
                          onClick={() => handleDeleteKey(key.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <span className="sr-only">Delete</span>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create API Key Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create a New API Key</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Enter a name and limit for the new API key.
              </p>
              
              <form onSubmit={handleCreateKey}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a unique name to identify this key"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Limit monthly usage*
                  </label>
                  <input
                    type="number"
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Usage Alerts Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Email usage alerts</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            An alert will be sent to your email when your monthly usage reaches the set threshold.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value="90"
                className="w-16 px-2 py-1 border rounded"
              />
              <span>%</span>
            </div>
            <button className="text-gray-500 hover:text-gray-700">✏️</button>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked className="rounded" />
              <span>Enabled</span>
            </label>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Have any questions, feedback or need support? We'd love to hear from you!
          </p>
          <button className="px-6 py-2 border rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">
            Contact us
          </button>
        </div>
      </div>
    </div>
  );
}
