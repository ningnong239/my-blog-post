// Debug signup functionality
import { authService } from '@/services/supabaseService';
import { supabase } from '@/lib/supabase';

export const debugSignup = async () => {
  console.log('🔍 Starting signup debug...');
  
  // Test 1: Check Supabase connection
  console.log('1. Testing Supabase connection...');
  const { data: connectionTest, error: connectionError } = await supabase
    .from('users')
    .select('count')
    .limit(1);
  
  if (connectionError) {
    console.error('❌ Supabase connection failed:', connectionError);
    return;
  }
  console.log('✅ Supabase connection successful');

  // Test 2: Check RLS policies
  console.log('2. Checking RLS policies...');
  const { data: rlsCheck, error: rlsError } = await supabase
    .from('users')
    .select('id')
    .limit(1);
  
  if (rlsError) {
    console.error('❌ RLS policy issue:', rlsError);
  } else {
    console.log('✅ RLS policies working');
  }

  // Test 3: Test signup
  console.log('3. Testing signup...');
  const testEmail = `debugtest${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  const testName = 'Debug Test User';

  try {
    const result = await authService.signUp(testEmail, testPassword, testName);
    
    if (result.error) {
      console.error('❌ Signup failed:', result.error);
    } else {
      console.log('✅ Signup successful:', result.data);
      
      // Test 4: Check if user was created in users table
      console.log('4. Checking if user was created in users table...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', testEmail)
        .single();
      
      if (userError) {
        console.error('❌ User not found in users table:', userError);
      } else {
        console.log('✅ User found in users table:', userData);
      }
    }
  } catch (error) {
    console.error('❌ Signup error:', error);
  }
};

// Auto-run debug when imported
if (typeof window !== 'undefined') {
  console.log('🔧 Signup debug utilities loaded. Run debugSignup() to debug.');
}
