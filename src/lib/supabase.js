import { createClient } from '@supabase/supabase-js'

// Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rxlmkbwpfruzzvnlgqtr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bG1rYndwZnJ1enp2bmxncXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzQ1NzQsImV4cCI6MjA3NjA1MDU3NH0.f94b1dijSybhscyx1tCaO6faCoDqNQTKsolesCMFhqo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for admin operations (server-side only)
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bG1rYndwZnJ1enp2bmxncXRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ3NDU3NCwiZXhwIjoyMDc2MDUwNTc0fQ.mj-FdjFLlSjVtq03xrRahj58QspfD0pBdLjKZrhfFzs'
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Debug function
export const debugSupabase = () => {
  console.log('🔧 Supabase Configuration:');
  console.log('URL:', supabaseUrl);
  console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
}