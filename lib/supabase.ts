import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vszaaobgjxacvvoozmhd.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzemFhb2JnanhhY3Z2b296bWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDUzNjIsImV4cCI6MjA5ODY4MTM2Mn0.fd8pw-bcFwN1c0KNhTRIbJy1IXatqQrlqtdm6I0ksFo'

// Create a single supabase client for the entire app
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export { supabase }
export default supabase
