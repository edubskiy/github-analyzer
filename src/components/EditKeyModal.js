'use client';

import { useState } from 'react';

export default function EditKeyModal({ keyData, onClose, onSave }) {
  const [name, setName] = useState(keyData.name);
  const [monthlyLimit, setMonthlyLimit] = useState(keyData.monthly_limit.toString());

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...keyData,
      name,
      monthly_limit: parseInt(monthlyLimit)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md shadow-2xl border border-gray-800">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Edit API Key</h2>
            <p className="text-sm text-gray-400">
              Update the name and monthly usage limit for your API key.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Key Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Key Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                onClick={onClose}
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 