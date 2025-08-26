import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function createClient() {
  // For server-side, we use the same client but with service role key if needed
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}