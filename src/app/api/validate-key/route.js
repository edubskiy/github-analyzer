import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    

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