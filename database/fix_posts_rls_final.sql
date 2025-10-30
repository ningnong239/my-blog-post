-- แก้ไข RLS สำหรับ posts table ให้ทำงานได้ทั้ง anonymous และ authenticated users
-- Run this in Supabase SQL Editor

-- 1. ลบ policies ทั้งหมดที่มีอยู่
DO $$ 
BEGIN
    -- Drop all existing policies on posts table
    EXECUTE (
        SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON posts;', ' ')
        FROM pg_policies 
        WHERE tablename = 'posts'
    );
END $$;

-- 2. ปิด RLS ชั่วคราว
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- 3. เปิด RLS อีกครั้ง
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 4. สร้าง policies ใหม่ที่ชัดเจน

-- Policy 1: ให้ทุกคนอ่านได้ (SELECT) ไม่ว่าจะ login หรือไม่
CREATE POLICY "allow_public_select" ON posts
    FOR SELECT
    USING (true);

-- Policy 2: ให้คนที่ login แล้วสามารถทำทุกอย่างได้ (INSERT, UPDATE, DELETE)
CREATE POLICY "allow_authenticated_all" ON posts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. ตรวจสอบว่า RLS เปิดอยู่
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN '✅ RLS Enabled' ELSE '❌ RLS Disabled' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'posts';

-- 6. แสดง policies ทั้งหมดที่มีอยู่
SELECT 
    policyname as "Policy Name",
    cmd as "Command",
    CASE 
        WHEN roles = '{public}' THEN 'Everyone'
        WHEN roles = '{authenticated}' THEN 'Logged-in users'
        ELSE array_to_string(roles, ', ')
    END as "Who",
    CASE 
        WHEN qual = 'true' THEN '✅ All rows'
        ELSE qual
    END as "Condition"
FROM pg_policies 
WHERE tablename = 'posts'
ORDER BY policyname;

-- 7. ทดสอบ query (ควรได้ 5 posts)
SELECT 
    id, 
    title, 
    category_id, 
    status_id,
    CASE 
        WHEN status_id = 1 THEN 'Draft'
        WHEN status_id = 2 THEN 'Published'
        ELSE 'Unknown'
    END as status_name
FROM posts 
ORDER BY id;

-- 8. นับจำนวน posts
SELECT COUNT(*) as "Total Posts" FROM posts;

