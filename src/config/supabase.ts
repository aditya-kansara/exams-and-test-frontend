/**
 * Supabase Configuration
 * 
 * Environment variables required:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous key
 * 
 * To set these up:
 * 1. Create a .env.local file in the frontend directory
 * 2. Add the following variables:
 *    NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
 */

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

// Validate configuration
if (!supabaseConfig.url) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
    'Please create a .env.local file with your Supabase URL.'
  )
}

if (!supabaseConfig.anonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
    'Please create a .env.local file with your Supabase anonymous key.'
  )
}
