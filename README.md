# My Blog Post

A modern blog platform built with React, Vite, and Supabase. Features include user authentication, article management, category system, and responsive design.

## 🚀 Features

- **User Authentication** - Login, signup, and profile management with Supabase
- **Article Management** - Create, read, update, and delete blog posts
- **Category System** - Organize posts by categories (Dev, LifeStyle, General)
- **Admin Dashboard** - Complete admin panel for content management
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Data** - Supabase integration for live data updates
- **Toast Notifications** - User-friendly feedback system

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Real-time)
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-blog-post
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

The project uses Supabase with the following main tables:

- **users** - User profiles and authentication
- **posts** - Blog articles with content and metadata
- **categories** - Post categorization system
- **comments** - User comments on posts

## 🎨 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Headless UI components
│   └── auth/           # Authentication components
├── contexts/           # React contexts (Auth, etc.)
├── lib/               # Utilities and configurations
├── page/              # Page components
│   └── admin/         # Admin dashboard pages
├── services/          # API services and Supabase integration
└── utils/             # Helper functions
```

## 🔐 Authentication

- **User Registration** - Email/password signup
- **User Login** - Secure authentication with Supabase
- **Profile Management** - Update user information
- **Admin Access** - Special admin privileges for content management

## 📝 Content Management

### For Users
- View blog posts and articles
- Filter by categories
- Read full articles with rich content
- User profile management

### For Admins
- Create, edit, and delete articles
- Manage categories
- User management
- Content moderation

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automatically on push to main branch

### Environment Variables
Make sure to set these in your deployment platform:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 🧪 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📱 Responsive Design

- **Mobile-first** approach
- **Tailwind CSS** for styling
- **Responsive breakpoints** for all screen sizes
- **Touch-friendly** interface

## 🔧 Configuration

- **Vite** for fast development and building
- **ESLint** for code quality
- **Tailwind CSS** for utility-first styling
- **React Router** for client-side routing

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using React, Vite, and Supabase**
