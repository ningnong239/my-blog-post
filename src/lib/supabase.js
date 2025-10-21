import { createClient } from '@supabase/supabase-js'

// Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rxlmkbwpfruzzvnlgqtr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bG1rYndwZnJ1enp2bmxncXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzQ1NzQsImV4cCI6MjA3NjA1MDU3NH0.f94b1dijSybhscyx1tCaO6faCoDqNQTKsolesCMFhqo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)