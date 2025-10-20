-- Fix RLS policies for users table
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Public user profiles are viewable" ON users;

-- Create more permissive policies for development
-- Policy: Allow all operations for authenticated users
CREATE POLICY "Authenticated users can do everything" ON users
    FOR ALL USING (auth.role() = 'authenticated');

-- Policy: Allow public read access
CREATE POLICY "Public read access" ON users
    FOR SELECT USING (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';
