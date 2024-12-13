import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateApiKey = () => {
    return `sk_${Math.random().toString(36).substr(2, 32)}`;
  };

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
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createApiKey = async (name, monthlyLimit) => {
    try {
      const newKey = {
        name,
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
      setApiKeys(prevKeys => [data[0], ...prevKeys]);
      return data[0];
    } catch (error) {
      console.error('Error creating API key:', error.message);
      throw error;
    }
  };

  const deleteApiKey = async (keyId) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;
      
      setApiKeys(prevKeys => prevKeys.filter(key => key.id !== keyId));
    } catch (error) {
      console.error('Error deleting API key:', error.message);
      throw error;
    }
  };

  const updateApiKey = async (keyId, updates) => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update(updates)
        .eq('id', keyId)
        .select();

      if (error) throw error;
      setApiKeys(apiKeys.map(key => 
        key.id === keyId ? data[0] : key
      ));
      return data[0];
    } catch (error) {
      console.error('Error updating API key:', error.message);
      throw error;
    }
  };

  return {
    apiKeys,
    isLoading,
    fetchApiKeys,
    createApiKey,
    deleteApiKey,
    updateApiKey
  };
} 