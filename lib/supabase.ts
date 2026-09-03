import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vszaaobgjxacvvoozmhd.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzemFhb2JnanhhY3Z2b296bWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDUzNjIsImV4cCI6MjA5ODY4MTM2Mn0.fd8pw-bcFwN1c0KNhTRIbJy1IXatqQrlqtdm6I0ksFo'

let client: SupabaseClient | null = null

// Lazy client so importing modules (e.g. during static generation) does not
// open network connections or throw when Supabase env vars are absent.
export function getSupabase(): SupabaseClient | null {
  if (client) return client
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }
  client = createClient(supabaseUrl, supabaseAnonKey)
  return client
}
