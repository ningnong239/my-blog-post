-- Check posts data and disable RLS
-- Run this in Supabase SQL Editor

-- Disable RLS temporarily to test data access
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE statuses DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;

-- Check if posts table has data
SELECT 
    id,
    title,
    category_id,
    status_id,
    created_at
FROM posts 
ORDER BY created_at DESC 
LIMIT 5;

-- Check posts count
SELECT COUNT(*) as total_posts FROM posts;

-- Check if posts have valid IDs
SELECT 
    id,
    title,
    CASE 
        WHEN id IS NULL THEN 'NULL ID'
        WHEN id = '' THEN 'EMPTY ID'
        ELSE 'VALID ID'
    END as id_status
FROM posts 
LIMIT 5;

-- Verify RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('posts', 'categories', 'statuses', 'users', 'profiles', 'comments', 'likes')
ORDER BY tablename;
