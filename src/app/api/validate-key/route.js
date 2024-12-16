import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    // Query Supabase to check if the API key exists and is valid
    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .eq('key', apiKey)
      .single();

    if (error || !data) {
      return Response.json({ valid: false });
    }

    return Response.json({ valid: true });
  } catch (error) {
    return Response.json({ valid: false });
  }
} 