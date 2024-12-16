import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';
import { supabase } from '../lib/supabaseClient';

// Export the middleware function as default
export default async function middleware(request) {
  // Check if accessing protected route
  if (request.nextUrl.pathname.startsWith('/protected')) {
    const apiKey = request.headers.get('x-api-key') || request.cookies.get('apiKey')?.value;

    if (!apiKey) {
      return NextResponse.redirect(new URL('/playground', request.url));
    }

    try {
      // Validate API key
      const { data, error } = await supabase
        .from('api_keys')
        .select('id')
        .eq('key', apiKey)
        .single();

      if (error || !data) {
        return NextResponse.redirect(new URL('/playground', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/playground', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/protected/:path*']
}; 