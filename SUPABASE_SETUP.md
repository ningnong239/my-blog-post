# 🚀 Supabase Setup Instructions

## 1. Database Setup

### Step 1: Run SQL Schema
1. เปิด Supabase Dashboard: https://supabase.com/dashboard
2. เลือกโปรเจคของคุณ
3. ไปที่ **SQL Editor**
4. Copy และ paste เนื้อหาจาก `database/schema.sql`
5. กด **Run** เพื่อสร้าง tables และ policies

### Step 2: Verify Tables Created
ตรวจสอบว่า tables ถูกสร้างแล้ว:
- `categories`
- `profiles` 
- `posts`
- `comments`

## 2. Environment Variables

สร้างไฟล์ `.env.local` ใน root directory:

```env
VITE_SUPABASE_URL=https://rxlmkbwpfruzzvnlgqtr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bG1rYndwZnJ1enp2bmxncXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzQ1NzQsImV4cCI6MjA3NjA1MDU3NH0.f94b1dijSybhscyx1tCaO6faCoDqNQTKsolesCMFhqo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bG1rYndwZnJ1enp2bmxncXRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ3NDU3NCwiZXhwIjoyMDc2MDUwNTc0fQ.mj-FdjFLlSjVtq03xrRahj58QspfD0pBdLjKZrhfFzs
```

## 3. Authentication Setup

### Step 1: Enable Email Authentication
1. ไปที่ **Authentication** > **Settings**
2. เปิด **Enable email confirmations** (optional)
3. เปิด **Enable email change confirmations** (optional)

### Step 2: Create Admin User
1. ไปที่ **Authentication** > **Users**
2. สร้าง user ใหม่
3. ไปที่ **Table Editor** > **profiles**
4. แก้ไข role เป็น `admin` สำหรับ user ที่สร้าง

## 4. Row Level Security (RLS)

RLS policies ถูกสร้างแล้วใน schema.sql:
- **Categories**: ทุกคนอ่านได้, เฉพาะ admin เขียนได้
- **Posts**: ทุกคนอ่านได้, เฉพาะเจ้าของและ admin เขียนได้
- **Comments**: ทุกคนอ่านได้, เฉพาะเจ้าของและ admin เขียนได้
- **Profiles**: ทุกคนอ่านได้, เฉพาะเจ้าของแก้ไขได้

## 5. Testing

### Step 1: Start Development Server
```bash
npm run dev
```

### Step 2: Check Console
เปิด Developer Console (F12) และดู debug messages:
- `🔧 Supabase Configuration:`
- `[ArticlesSection] Fetching categories from Supabase`
- `[ArticlesSection] Posts fetched successfully`

### Step 3: Test Features
1. **Homepage**: ควรแสดง posts จาก Supabase
2. **Categories**: ควรแสดง categories จาก database
3. **Search**: ควรค้นหาใน Supabase
4. **Authentication**: ควรทำงานกับ Supabase Auth

## 6. Troubleshooting

### Problem: "No categories found"
**Solution**: ตรวจสอบว่า categories table มีข้อมูลหรือไม่

### Problem: "Authentication failed"
**Solution**: ตรวจสอบ Supabase URL และ keys

### Problem: "RLS policy violation"
**Solution**: ตรวจสอบ user permissions และ policies

### Problem: "Database not initialized"
**Solution**: ตรวจสอบว่า schema.sql ถูก run แล้ว

## 7. Debug Commands

### Check Supabase Connection
```javascript
// ใน Browser Console
import { debugSupabase } from '@/lib/supabase';
debugSupabase();
```

### Test API Calls
```javascript
// ใน Browser Console
import { postsService } from '@/services/supabaseService';
postsService.getPosts({ page: 1, limit: 6 });
```

## 8. Production Deployment

### Vercel Deployment
1. เพิ่ม environment variables ใน Vercel dashboard
2. Deploy ตามปกติ
3. ตรวจสอบ logs ใน Vercel dashboard

### Environment Variables for Production
```env
VITE_SUPABASE_URL=https://rxlmkbwpfruzzvnlgqtr.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 9. Monitoring

### Supabase Dashboard
- **Database**: ดู table data และ queries
- **Authentication**: ดู user activity
- **Logs**: ดู error logs และ performance

### Application Logs
- เปิด Developer Console
- ดู debug messages ที่ขึ้นต้นด้วย `[DEBUG]`, `[ERROR]`, `[WARN]`

## 10. Backup & Recovery

### Database Backup
1. ไปที่ **Database** > **Backups**
2. สร้าง manual backup
3. Download backup file

### Data Export
```sql
-- Export posts
SELECT * FROM posts;

-- Export categories  
SELECT * FROM categories;

-- Export users
SELECT * FROM profiles;
```

---

## ✅ Checklist

- [ ] Database schema created
- [ ] Environment variables set
- [ ] Authentication configured
- [ ] RLS policies active
- [ ] Admin user created
- [ ] Development server running
- [ ] Console logs showing success
- [ ] Homepage loading posts
- [ ] Categories working
- [ ] Search functioning
- [ ] Authentication working

---

## 🆘 Support

หากมีปัญหา:
1. ตรวจสอบ Console logs
2. ดู Supabase Dashboard logs
3. ตรวจสอบ Network tab ใน DevTools
4. ดู RLS policies ใน Supabase
