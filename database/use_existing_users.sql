-- Use existing users to create sample data
-- Run this in Supabase SQL Editor

-- 1. Insert sample posts using existing users
WITH first_user AS (
    SELECT id, username, name, email FROM users LIMIT 1
),
publish_status AS (
    SELECT id FROM statuses WHERE status = 'publish' LIMIT 1
)
INSERT INTO posts (title, description, content, image, category_id, likes_count, status_id, date)
SELECT 
    post_data.title,
    post_data.description,
    post_data.content,
    post_data.image,
    c.id as category_id,
    post_data.likes_count,
    ps.id as status_id,
    NOW() as date
FROM (
    VALUES 
    (
        'Getting Started as a Developer: Your First Steps into the Programming World',
        'A beginner-friendly guide for those interested in becoming a developer—covering the essentials, must-have skills, and practical tips to kickstart your dev career.',
        '## 1. What is a Developer?

A developer, or programmer, is someone who builds and creates software, websites, or applications to fulfill user needs and solve problems.

## 2. Essential Skills for Aspiring Devs

- Problem-solving and logical thinking
- Basic knowledge of programming (e.g., HTML, CSS, JavaScript)
- Learning popular languages like JavaScript, Python, or Java

## 3. Types of Developer Roles

- **Frontend Developer:** Focuses on the visual part of websites/apps (UI/UX)
- **Backend Developer:** Deals with the server, databases, and logic behind the scenes
- **Full Stack Developer:** Skilled in both frontend and backend development

## 4. Tools & Learning Resources

- Git and GitHub for version control and collaboration
- Online communities and tutorials like Stack Overflow, YouTube, FreeCodeCamp, or Codecademy
- Practice building your own projects to gain hands-on experience

## 5. Tips for Beginners

- Set small, achievable goals
- Don''t be afraid to make mistakes—trial and error is a great teacher
- Join developer communities to share, learn, and grow together',
        'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/dev-thumb-example.jpg',
        'Dev',
        199
    ),
    (
        'Cooking in English: Essential Vocabulary and Phrases for the Kitchen',
        'Expand your English skills with must-know vocabulary, phrases, and conversations for cooking and following recipes.',
        '## 1. Common Cooking Verbs

- **Boil** (ต้ม)
- **Chop** (หั่น)
- **Stir** (คน)
- **Fry** (ทอด)
- **Bake** (อบ)
- **Grill** (ย่าง)
- **Peel** (ปอกเปลือก)
- **Mix** (ผสม)
- **Roast** (อบ/ปิ้ง)

## 2. Essential Kitchen Vocabulary

- **Pot** (หม้อ)
- **Pan** (กระทะ)
- **Knife** (มีด)
- **Spoon** (ช้อน)
- **Fork** (ส้อม)
- **Bowl** (ชาม)
- **Oven** (เตาอบ)
- **Stove** (เตา)

## 3. Useful Cooking Phrases

- "Please chop the onions."
- "How many eggs do we need?"
- "Simmer the soup for 10 minutes."
- "Can you pass me the salt?"
- "Preheat the oven to 180 degrees."

## 4. Reading a Recipe in English

1. Gather all the ingredients.
2. Slice the vegetables.
3. Heat the oil in a pan.
4. Add the vegetables and stir-fry for 5 minutes.
5. Serve hot.

## 5. Sample Conversation

**A:** What are you cooking today?  
**B:** I''m making stir-fried chicken with vegetables.  
**A:** Can I help you?  
**B:** Sure! Please wash and chop the carrots.

Cooking is a great way to learn new English words and practice speaking. Enjoy your meal! 🍳',
        'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/gsutzgam24abrvgee9r4.jpg',
        'Liftstyle',
        123
    ),
    (
        'The Power of Habits: Small Changes, Big Results',
        'Discover how small, consistent habits can lead to significant personal and professional growth over time.',
        '## 1. Understanding Habit Formation

Learn the science behind habit formation and why habits are so powerful in shaping our lives.

## 2. Identifying Key Habits

Discover how to identify the habits that will have the most significant impact on your goals.

## 3. Building Positive Habits

Explore strategies for successfully implementing and maintaining positive habits.

## 4. Breaking Bad Habits

Learn effective techniques for identifying and breaking detrimental habits.

## 5. Habit Stacking

Understand how to use habit stacking to make new habits easier to adopt and maintain.',
        'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/g8qpepvgnz6gioylyhrz.jpg',
        'General',
        515
    ),
    (
        'Movie Night: Learning English While Watching Films',
        'Unlock effective ways to improve your English skills by watching movies, including tips for active viewing and vocabulary building.',
        '## 1. Benefits of Watching Movies to Learn English

Watching movies is an enjoyable way to enhance your listening skills, expand your vocabulary, and get familiar with different accents.

## 2. Movie Genres You Can Try

- Comedy (ตลก)
- Drama (ดราม่า)
- Action (แอ็คชั่น)
- Animation (แอนิเมชัน)
- Documentary (สารคดี)
- Romance (โรแมนติก)

## 3. Tips for Learning Effectively

- **Turn on English subtitles** for better understanding.
- **Pause and rewind** if you miss something or want to hear a word again.
- **Write down new vocabulary** and search for their meanings later.
- **Repeat sentences aloud** to practice speaking and pronunciation.

## 4. Useful Movie-Related Vocabulary

- **Plot** (เนื้อเรื่อง)
- **Character** (ตัวละคร)
- **Scene** (ฉาก)
- **Director** (ผู้กำกับ)
- **Actor/Actress** (นักแสดงชาย/หญิง)
- **Soundtrack** (เพลงประกอบภาพยนตร์)
- **Sequel** (ภาคต่อ)
- **Subtitle** (คำบรรยาย)

## 5. Sample Dialogue at the Cinema

**A:** What movie do you want to watch tonight?  
**B:** Let''s see a comedy. I need a laugh!  
**A:** Should we buy tickets in advance?  
**B:** Yes, and don''t forget the popcorn!

Watching movies regularly makes learning English fun and natural. Pick your favorite genres and enjoy practicing English during your next movie night! 🍿',
        'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/zzye4nxfm3pmh81z7hni.jpg',
        'General',
        21
    ),
    (
        'Level Up! The Benefits of Playing Games',
        'Discover how playing games can improve your skills, creativity, and English vocabulary, along with tips for balanced gaming.',
        '## 1. Skills Gained from Gaming

Playing games helps build focus, quick problem-solving, and decision-making abilities. It can also improve your English skills by exposing you to new words and conversations.

## 2. English Vocabulary Commonly Found in Games

- **Level**
- **Mission/Quest**
- **Score**
- **Team**
- **Inventory**
- **Upgrade**
- **Challenge**
- **Co-op**

## 3. Tips for Healthy Gaming

- Set a daily time limit for playing games.
- Take regular breaks to rest your eyes and body.
- Play with friends or family for added fun and social skills.
- Use English vocabulary and phrases you learn from games in real life.

## 4. Sample Conversation about Gaming

**A:** What game are you playing now?  
**B:** I''m playing an adventure game with my friends.  
**A:** Is it fun?  
**B:** Yes! I''m learning new English words from it, too.

Enjoy playing games responsibly—they can be both fun and a great way to learn English! 🎮',
        'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/e0haxst38li4g8i0vpsr.jpg',
        'General',
        32
    )
) AS post_data(title, description, content, image, category_name, likes_count)
JOIN categories c ON c.name = post_data.category_name
CROSS JOIN publish_status ps;

-- 2. Insert sample comments using existing users
WITH post_ids AS (
    SELECT id FROM posts LIMIT 3
),
random_users AS (
    SELECT id FROM users ORDER BY RANDOM() LIMIT 3
)
INSERT INTO comments (post_id, user_id, comment_text, created_at)
SELECT 
    pi.id as post_id,
    ru.id as user_id,
    comment_data.comment_text,
    NOW() as created_at
FROM post_ids pi
CROSS JOIN random_users ru
CROSS JOIN (
    VALUES 
    ('Great article! Very helpful for beginners.'),
    ('Thanks for sharing these tips!'),
    ('I learned a lot from this post.'),
    ('This is exactly what I was looking for.'),
    ('Amazing content, keep it up!'),
    ('Very informative, thank you!'),
    ('This helped me understand better.'),
    ('Excellent explanation!'),
    ('I will try this approach.'),
    ('Great work!')
) AS comment_data(comment_text);

-- 3. Insert sample likes using existing users
WITH post_ids AS (
    SELECT id FROM posts LIMIT 3
),
random_users AS (
    SELECT id FROM users ORDER BY RANDOM() LIMIT 3
)
INSERT INTO likes (post_id, user_id, liked_at)
SELECT 
    pi.id as post_id,
    ru.id as user_id,
    NOW() as liked_at
FROM post_ids pi
CROSS JOIN random_users ru;

-- 4. Verify data insertion
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Posts' as table_name, COUNT(*) as count FROM posts
UNION ALL
SELECT 'Comments' as table_name, COUNT(*) as count FROM comments
UNION ALL
SELECT 'Likes' as table_name, COUNT(*) as count FROM likes
UNION ALL
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Statuses' as table_name, COUNT(*) as count FROM statuses;
