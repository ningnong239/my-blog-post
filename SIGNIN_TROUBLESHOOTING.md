# 🔐 Signin Troubleshooting Guide

## ปัญหาที่พบบ่อยและวิธีแก้ไข

### 1. **ตรวจสอบ Supabase Configuration**

เปิด Developer Console (F12) และดู debug messages:

```javascript
// ควรเห็นข้อความนี้:
🔧 Supabase Configuration:
URL: https://rxlmkbwpfruzzvnlgqtr.supabase.co
Anon Key: ✅ Set
Service Key: ✅ Set
```

### 2. **ตรวจสอบ Database Schema**

#### Step 1: เปิด Supabase Dashboard
1. ไปที่ https://supabase.com/dashboard
2. เลือกโปรเจคของคุณ
3. ไปที่ **SQL Editor**

#### Step 2: รัน Schema
```sql
-- Copy และ paste เนื้อหาจาก database/schema.sql
-- กด Run เพื่อสร้าง tables
```

#### Step 3: ตรวจสอบ Tables
ไปที่ **Table Editor** และตรวจสอบว่ามี tables:
- `categories`
- `profiles`
- `posts`
- `comments`

### 3. **สร้าง Test User**

#### วิธีที่ 1: ใช้ Supabase Dashboard
1. ไปที่ **Authentication** > **Users**
2. กด **Add user**
3. ใส่ข้อมูล:
   - Email: `test@example.com`
   - Password: `testpassword123`
   - Confirm Password: `testpassword123`

#### วิธีที่ 2: ใช้ Console
เปิด Developer Console และรัน:

```javascript
// Import test functions
import { createTestUser, testLogin } from './src/utils/testSupabase';

// สร้าง test user
createTestUser().then(result => {
  console.log('Test user result:', result);
});

// ทดสอบ login
testLogin('test@example.com', 'testpassword123').then(result => {
  console.log('Login test result:', result);
});
```

### 4. **ตรวจสอบ Authentication Settings**

#### Step 1: เปิด Authentication Settings
1. ไปที่ **Authentication** > **Settings**
2. ตรวจสอบ **Site URL**: `http://localhost:3000`
3. ตรวจสอบ **Redirect URLs**: `http://localhost:3000/**`

#### Step 2: เปิด Email Authentication
1. ไปที่ **Authentication** > **Settings**
2. เปิด **Enable email confirmations** (optional)
3. เปิด **Enable email change confirmations** (optional)

### 5. **ตรวจสอบ RLS Policies**

#### Step 1: ตรวจสอบ Profiles Table
```sql
-- ตรวจสอบ RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

#### Step 2: ตรวจสอบ User Profile
```sql
-- ตรวจสอบ user profile
SELECT * FROM profiles WHERE email = 'test@example.com';
```

### 6. **Debug Steps**

#### Step 1: เปิด Developer Console
1. กด F12
2. ไปที่ Console tab
3. ลอง login และดู error messages

#### Step 2: ตรวจสอบ Network Tab
1. ไปที่ Network tab
2. ลอง login
3. ดู API calls ที่ fail

#### Step 3: ตรวจสอบ Application Tab
1. ไปที่ Application tab
2. ดู Local Storage
3. ตรวจสอบ Supabase session

### 7. **Common Errors และวิธีแก้ไข**

#### Error: "Invalid login credentials"
**สาเหตุ**: Email หรือ password ผิด
**วิธีแก้**: ตรวจสอบข้อมูลที่กรอก

#### Error: "Email not confirmed"
**สาเหตุ**: Email ยังไม่ได้ confirm
**วิธีแก้**: เปิด email confirmation หรือปิดการ confirm

#### Error: "User not found"
**สาเหตุ**: User ยังไม่ได้สร้างใน profiles table
**วิธีแก้**: ตรวจสอบ trigger function

#### Error: "RLS policy violation"
**สาเหตุ**: Row Level Security block
**วิธีแก้**: ตรวจสอบ RLS policies

### 8. **Test Commands**

#### ตรวจสอบ Supabase Connection
```javascript
// ใน Console
import { testSupabaseConnection } from './src/utils/testSupabase';
testSupabaseConnection();
```

#### ตรวจสอบ Auth Service
```javascript
// ใน Console
import { authService } from './src/services/supabaseService';

// ทดสอบ sign in
authService.signIn('test@example.com', 'testpassword123')
  .then(result => console.log('Sign in result:', result))
  .catch(error => console.error('Sign in error:', error));
```

#### ตรวจสอบ Current User
```javascript
// ใน Console
import { supabase } from './src/lib/supabase';

supabase.auth.getUser()
  .then(result => console.log('Current user:', result.data.user))
  .catch(error => console.error('Get user error:', error));
```

### 9. **Step-by-Step Testing**

#### Step 1: ตรวจสอบ Configuration
```javascript
// ควรเห็น:
🔧 Supabase Configuration:
URL: https://rxlmkbwpfruzzvnlgqtr.supabase.co
Anon Key: ✅ Set
Service Key: ✅ Set
```

#### Step 2: ตรวจสอบ Database
```javascript
// ควรเห็น:
✅ Database connection successful
📊 Categories found: 5
```

#### Step 3: ตรวจสอบ Auth
```javascript
// ควรเห็น:
✅ Auth service working
👤 Current user: Not logged in
```

#### Step 4: ทดสอบ Login
```javascript
// ควรเห็น:
🔐 Testing login...
✅ Login successful
👤 User: test@example.com
🎫 Session: Active
```

### 10. **Production Checklist**

- [ ] Database schema created
- [ ] RLS policies active
- [ ] Test user created
- [ ] Authentication settings configured
- [ ] Site URL set correctly
- [ ] Redirect URLs configured
- [ ] Email confirmation settings
- [ ] Console logs showing success
- [ ] Login form working
- [ ] User session persisting

---

## 🆘 หากยังมีปัญหา

1. **ตรวจสอบ Console Logs** - ดู error messages
2. **ตรวจสอบ Network Tab** - ดู API calls
3. **ตรวจสอบ Supabase Dashboard** - ดู logs และ users
4. **ตรวจสอบ Database** - ดู tables และ data
5. **ตรวจสอบ RLS Policies** - ดู permissions

หากยังแก้ไม่ได้ กรุณาแจ้ง error message ที่เจอใน Console ครับ
