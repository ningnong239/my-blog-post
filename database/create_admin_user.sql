-- Create Admin User and Profile
-- Run this in Supabase SQL Editor

-- 1. First, create the user in Authentication > Users manually
-- Email: admin@example.com
-- Password: admin123456
-- Then run this script to create the profile

-- 2. Create admin profile
INSERT INTO profiles (id, email, full_name, role)
SELECT 
    au.id,
    au.email,
    'Admin User' as full_name,
    'admin' as role
FROM auth.users au
WHERE au.email = 'admin@example.com'
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Admin User',
    updated_at = NOW();

-- 3. Verify admin user creation
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.created_at
FROM profiles p
WHERE p.role = 'admin';
