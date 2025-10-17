import { createClient } from '@supabase/supabase-js'

// You need to replace these with your actual Supabase project credentials
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
