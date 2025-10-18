-- Setup RLS policies for users table
-- Run this in Supabase SQL Editor

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own data (for signup)
CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Everyone can read user data (for public profiles)
CREATE POLICY "Public user profiles are viewable" ON users
    FOR SELECT USING (true);

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';
