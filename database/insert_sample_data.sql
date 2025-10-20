-- Insert sample data into Supabase
-- Run this in Supabase SQL Editor

-- 1. Insert categories
INSERT INTO categories (id, name) VALUES 
(1, 'Dev'),
(2, 'Liftstyle'),
(3, 'General')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Insert statuses
INSERT INTO statuses (id, name) VALUES 
(1, 'draft'),
(2, 'published'),
(3, 'archived')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Insert sample posts
INSERT INTO posts (title, description, content, image, category_id, likes_count, status_id, date) VALUES 
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
  1,
  199,
  2,
  NOW()
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
  3,
  515,
  2,
  NOW()
),
(
  'Cooking in English: Essential Vocabulary for Food Lovers',
  'Expand your English skills with must-know cooking terms and phrases that will help you follow recipes and talk about food like a pro.',
  '## 1. Common Cooking Verbs

- **Boil** (ต้ม) - to cook in boiling water
- **Fry** (ทอด) - to cook in hot oil
- **Bake** (อบ) - to cook in an oven
- **Grill** (ย่าง) - to cook over direct heat
- **Steam** (นึ่ง) - to cook with steam

## 2. Kitchen Equipment

- **Cutting board** (เขียง) - a board for cutting food
- **Knife** (มีด) - a tool for cutting
- **Pan** (กระทะ) - a cooking vessel
- **Oven** (เตาอบ) - an appliance for baking

## 3. Cooking Techniques

- **Sauté** (ผัด) - to cook quickly in a small amount of oil
- **Simmer** (เคี่ยว) - to cook gently in liquid
- **Marinate** (หมัก) - to soak food in a seasoned liquid

## 4. Food Preparation

- **Chop** (สับ) - to cut into small pieces
- **Slice** (หั่น) - to cut into thin pieces
- **Dice** (หั่นเป็นลูกเต๋า) - to cut into small cubes
- **Mince** (สับละเอียด) - to cut very finely

## 5. Taste and Seasoning

- **Season** (ปรุงรส) - to add salt, pepper, or other spices
- **Taste** (ชิม) - to test the flavor
- **Adjust** (ปรับ) - to change the seasoning',
  'https://th.bing.com/th/id/R.f1e57c17c4c4',
  2,
  123,
  2,
  NOW()
),
(
  'Movie Night: Learning English While Watching Films',
  'Unlock effective ways to improve your English skills while enjoying your favorite movies and TV shows.',
  '## 1. Benefits of Watching Movies to Learn English

- **Real-world language** - Hear how English is actually spoken
- **Cultural context** - Understand cultural references and idioms
- **Visual learning** - Connect words with actions and expressions
- **Entertainment** - Make learning fun and engaging

## 2. Choosing the Right Content

- **Start with subtitles** - Use English subtitles to follow along
- **Pick familiar genres** - Choose movies you already know
- **Consider difficulty** - Start with simpler dialogue
- **Use animated films** - Often have clearer pronunciation

## 3. Active Watching Techniques

- **Repeat phrases** - Say lines out loud
- **Pause and rewind** - Review difficult parts
- **Take notes** - Write down new vocabulary
- **Discuss with friends** - Talk about what you watched

## 4. Vocabulary Building

- **Keep a movie journal** - Record new words and phrases
- **Use context clues** - Guess meaning from the situation
- **Look up words** - Use a dictionary for unknown terms
- **Practice pronunciation** - Repeat words until they sound right

## 5. Making It a Habit

- **Set a schedule** - Watch regularly, even if just 30 minutes
- **Join discussion groups** - Talk about movies with others
- **Share recommendations** - Exchange movie suggestions
- **Track progress** - Notice how your understanding improves',
  'https://tse3.mm.bing.net/th/id/OIP.BIWI1',
  2,
  21,
  2,
  NOW()
),
(
  'Level Up! The Benefits of Playing Games for Learning',
  'Discover how playing games can improve your cognitive skills, problem-solving abilities, and even help you learn new languages.',
  '## 1. Skills Gained from Gaming

- **Problem-solving** - Games present challenges that require creative thinking
- **Strategic thinking** - Planning and decision-making skills
- **Hand-eye coordination** - Improved motor skills and reflexes
- **Memory enhancement** - Remembering rules, patterns, and strategies

## 2. Language Learning Through Games

- **Interactive vocabulary** - Learn words in context
- **Reading comprehension** - Understand game instructions and dialogue
- **Listening skills** - Follow audio cues and instructions
- **Cultural exposure** - Learn about different cultures through games

## 3. Social Benefits

- **Teamwork** - Collaborate with other players
- **Communication** - Practice explaining strategies and ideas
- **Leadership** - Take charge in team-based games
- **Friendship** - Build relationships with fellow gamers

## 4. Cognitive Development

- **Attention span** - Focus for extended periods
- **Multitasking** - Handle multiple game elements simultaneously
- **Pattern recognition** - Identify recurring themes and strategies
- **Adaptability** - Adjust to changing game conditions

## 5. Choosing Educational Games

- **Language learning games** - Specifically designed for education
- **Puzzle games** - Enhance logical thinking
- **Simulation games** - Learn real-world skills
- **Strategy games** - Develop planning and decision-making',
  'https://i.ytimg.com/vi/X1tBEKFYKJg/max',
  3,
  32,
  2,
  NOW()
);

-- 4. Check the results
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Posts' as table_name, COUNT(*) as count FROM posts
UNION ALL
SELECT 'Statuses' as table_name, COUNT(*) as count FROM statuses;