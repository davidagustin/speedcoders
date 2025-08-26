# SpeedCoders - Interactive Learning Platform

A comprehensive web application for learning coding skills through interactive quizzes, regex training, language tricks, and frontend development tips. Built with Next.js, Supabase, and Redis.

## 🚀 Features

### 🔐 Authentication
- User registration and login with Supabase Auth
- Email verification
- Protected routes with middleware
- Session management

### 📚 LeetCode Practice
- Timed quizzes with real LeetCode problems
- Algorithm selection with multiple choice
- Editorial content integration
- Progress tracking and scoring
- Detailed results with explanations

### 🔍 Regex Trainer
- Interactive regex exercises
- Real-time pattern testing
- Multiple difficulty levels
- Solution explanations
- Category-based filtering

### 💻 Language Tricks
- Programming language-specific tips
- Code examples and explanations
- Difficulty-based filtering
- Search functionality
- Tag-based organization

### 🎨 Frontend Tricks
- React, CSS, and JavaScript tips
- Performance optimization techniques
- Modern web development patterns
- Interactive code examples

### 🗄️ Database & Caching
- Supabase PostgreSQL database
- Redis caching for performance
- User progress tracking
- Quiz attempt history

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Caching**: Upstash Redis
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd speedcoders
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with the following variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Redis (Upstash)
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   
   # Next.js
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL commands below to create the database schema
   - Enable Row Level Security (RLS) policies

5. **Set up Redis (Upstash)**
   - Create a new Upstash Redis database
   - Copy the REST URL and token to your environment variables

6. **Run the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Core Tables

```sql
-- Users (handled by Supabase Auth)
-- Problems
-- Quizzes
-- Quiz Questions
-- Quiz Attempts
-- Quiz Answers
-- Algorithms
```

### Sample Data Setup

```sql
-- Insert sample algorithms
INSERT INTO algorithms (name, category, description, time_complexity, space_complexity) VALUES
('Hash Table', 'Data Structures', 'Fast key-value lookups', 'O(1)', 'O(n)'),
('Two Pointers', 'Techniques', 'Efficient array traversal', 'O(n)', 'O(1)'),
('Sliding Window', 'Techniques', 'Contiguous subarray problems', 'O(n)', 'O(1)'),
('Dynamic Programming', 'Techniques', 'Optimal substructure problems', 'Varies', 'Varies'),
('Binary Search', 'Search', 'Efficient sorted array search', 'O(log n)', 'O(1)'),
('Depth-First Search', 'Graph', 'Tree/graph traversal', 'O(V + E)', 'O(V)'),
('Breadth-First Search', 'Graph', 'Level-order traversal', 'O(V + E)', 'O(V)'),
('Sorting', 'Algorithms', 'Array ordering', 'O(n log n)', 'O(1)');

-- Insert sample problems
INSERT INTO problems (title, difficulty, category, description, examples, constraints, solutions, leetcode_url) VALUES
('Two Sum', 'Easy', 'Array', 'Find two numbers that add up to target', '{"Input": "nums = [2,7,11,15], target = 9", "Output": "[0,1]"}', '{"2 <= nums.length <= 104", "-109 <= nums[i] <= 109", "-109 <= target <= 109"}', '["Hash Table", "Two Pointers"]', 'https://leetcode.com/problems/two-sum/'),
('Add Two Numbers', 'Medium', 'Linked List', 'Add two numbers represented by linked lists', '{"Input": "l1 = [2,4,3], l2 = [5,6,4]", "Output": "[7,0,8]"}', '{"1 <= l1.length, l2.length <= 100", "0 <= Node.val <= 9"}', '["Linked List", "Math"]', 'https://leetcode.com/problems/add-two-numbers/');

-- Insert sample quizzes
INSERT INTO quizzes (title, description, time_limit, difficulty, category, created_by) VALUES
('Array Basics', 'Practice fundamental array problems', 15, 'Easy', 'Array', 'system'),
('Linked List Fundamentals', 'Master linked list operations', 20, 'Medium', 'Linked List', 'system'),
('String Manipulation', 'Learn string processing techniques', 25, 'Medium', 'String', 'system');
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set environment variables in Vercel dashboard**

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables for Production

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key

# Redis
UPSTASH_REDIS_REST_URL=your_production_redis_url
UPSTASH_REDIS_REST_TOKEN=your_production_redis_token

# Next.js
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 📁 Project Structure

```
speedcoders/
├── app/
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Main dashboard
│   ├── leetcode/            # LeetCode practice section
│   ├── regex/               # Regex trainer
│   ├── languages/           # Language tricks
│   ├── frontend/            # Frontend tricks
│   ├── quiz/                # Quiz functionality
│   ├── admin/               # Admin dashboard
│   └── api/                 # API routes
├── utils/
│   ├── supabase/            # Supabase client utilities
│   └── redis.ts             # Redis utilities
├── prisma/                  # Database schema
├── public/                  # Static assets
└── middleware.ts            # Next.js middleware
```

## 🔧 Configuration

### Supabase Setup

1. **Enable Auth providers** in Supabase dashboard
2. **Set up RLS policies** for data security
3. **Configure email templates** for verification

### Redis Configuration

1. **Set up caching keys** in `utils/redis.ts`
2. **Configure TTL values** for different data types
3. **Implement cache invalidation** strategies

## 🎯 Usage

### For Students
1. Register an account
2. Choose a learning section
3. Practice with interactive exercises
4. Track your progress
5. Review detailed explanations

### For Educators
1. Create custom quizzes
2. Monitor student progress
3. Add new problems and tricks
4. Customize difficulty levels

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Authentication required for protected routes
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure session management

## 📊 Performance

- Redis caching for frequently accessed data
- Optimized database queries
- Lazy loading for large datasets
- Image optimization with Next.js
- CDN integration for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with more coding platforms
- [ ] AI-powered problem recommendations
- [ ] Video tutorial integration
- [ ] Community features and forums
- [ ] Gamification elements

---

Built with ❤️ for the coding community
