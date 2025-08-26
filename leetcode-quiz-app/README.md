# 🎯 LeetCode Quiz Master

A comprehensive interview preparation platform with **3,662+ LeetCode problems**, algorithm mastery tracking, and advanced analytics.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-4.4.5-646cff)

## 🚀 Features

### 📊 **Comprehensive Problem Database**
- **3,662+ LeetCode problems** with accurate algorithm mappings
- **200+ algorithms** across 20+ categories
- Company-specific problem sets (Google, Amazon, Microsoft, Facebook, Apple, Netflix)
- Real-time difficulty and topic filtering

### 🎯 **Advanced Quiz System**
- **8 Quiz Modes**: Smart, Company, Algorithm, Difficulty, Speed, Challenge, Study Plan, Custom
- AI-powered smart quiz generation based on user weaknesses
- Custom quiz creation from selected problems
- Real-time timer and progress tracking

### 📈 **Analytics & Progress Tracking**
- Algorithm mastery tracking with detailed progress
- Performance analytics with trend analysis
- Weakness identification and personalized recommendations
- XP system with leveling and achievements

### 🏢 **Interview Preparation**
- Company-specific preparation with insights
- Interview-style problem sets
- Performance benchmarks
- Study plans for structured learning

### 🏆 **Gamification**
- **20+ achievements** across 7 categories
- Local and global leaderboards
- Weekly competitions
- Streak tracking and rewards

### 📚 **Study Tools**
- 6 predefined study plans (FAANG, Algorithm Mastery, Speed Coding, etc.)
- Custom study plan creation
- Daily challenges and reminders
- Progress celebrations and milestones

## 🛠️ Technology Stack

- **Frontend**: React 18.2 + Vite
- **Styling**: Custom CSS with theme support
- **Routing**: React Router DOM
- **State Management**: React Hooks + Local Storage
- **Build Tool**: Vite with optimized bundling
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leetcode-quiz-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
leetcode-quiz-app/
├── src/
│   ├── components/           # React components
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── Quiz.jsx         # Quiz engine
│   │   ├── Analytics.jsx    # Performance analytics
│   │   ├── ProblemBrowser.jsx # Problem exploration
│   │   ├── CompanyMode.jsx  # Company interview prep
│   │   ├── AlgorithmMastery.jsx # Algorithm tracking
│   │   ├── StudyPlans.jsx   # Study plan management
│   │   ├── Leaderboard.jsx  # Competitive features
│   │   ├── Achievements.jsx # Achievement system
│   │   ├── Settings.jsx     # User preferences
│   │   ├── Results.jsx      # Quiz results
│   │   └── Login.jsx        # Authentication
│   ├── data/
│   │   ├── allProblems.js   # Master problems database
│   │   ├── batch1.js        # Problems 1-500 (curated)
│   │   ├── batch2.js        # Problems 501-1000 (curated)
│   │   └── problemGenerator.js # Problems 1001-3662 (generated)
│   ├── App.jsx              # Main app component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── vercel.json           # Deployment configuration
```

## 🎮 Usage Guide

### Getting Started
1. **Create Account**: Register or use demo accounts (Beginner/Intermediate/Expert)
2. **Explore Dashboard**: View your progress, daily challenges, and quick actions
3. **Browse Problems**: Use the advanced problem browser with filtering and search
4. **Take Quizzes**: Choose from 8 different quiz modes
5. **Track Progress**: Monitor your algorithm mastery and performance

### Quiz Modes
- **Smart Mode**: AI-powered selection based on your weaknesses
- **Company Mode**: Practice problems from specific companies
- **Algorithm Mode**: Focus on particular algorithms or data structures
- **Speed Mode**: Timed challenges for quick problem solving
- **Custom Mode**: Create quizzes from selected problems

### Study Features
- **Study Plans**: Follow structured 30-120 day learning paths
- **Daily Challenges**: Complete daily problems to maintain streaks
- **Algorithm Mastery**: Track proficiency across 200+ algorithms
- **Performance Analytics**: Identify strengths and improvement areas

## 🎯 Key Features Deep Dive

### Algorithm Mastery System
- Tracks performance across 200+ algorithms
- Categorizes algorithms into 20+ groups
- Provides mastery levels: Beginner, Novice, Intermediate, Advanced, Master
- Identifies weak areas for focused practice

### Company Interview Preparation
- **Google**: System design, algorithms, coding efficiency
- **Amazon**: Leadership principles, scalable solutions
- **Microsoft**: Problem-solving, system architecture
- **Facebook**: Product thinking, technical excellence
- **Apple**: Attention to detail, optimal solutions
- **Netflix**: Scale and performance optimization

### Achievement System
- **Problem Solving**: First Steps, Problem Crusher, Centurion, Legend
- **Accuracy**: Accurate Archer, Sharpshooter, Perfectionist
- **Streaks**: Getting Started, On Fire, Unstoppable
- **Special**: Algorithm Enthusiast, Early Bird, Night Owl

## 📊 Performance Optimizations

- **Code Splitting**: Vendor and problems chunks for faster loading
- **Lazy Loading**: Components loaded on demand
- **Asset Optimization**: Compressed CSS and JS bundles
- **Caching**: Optimized caching headers for static assets
- **Bundle Analysis**: Optimized bundle sizes for production

## 🌟 Advanced Features

### Smart Quiz Generation
Uses AI-powered analysis of user performance to:
- Identify weak algorithm areas
- Select problems targeting improvement areas
- Balance difficulty progression
- Adapt to user learning pace

### Real-time Analytics
- Performance trends over time
- Algorithm accuracy tracking
- Time spent analysis
- Weakness identification
- Personalized recommendations

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Adaptive layouts for all screen sizes
- Progressive Web App features

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build**: Vercel automatically detects Vite configuration
3. **Deploy**: Automatic deployments on every push to main branch
4. **Custom Domain**: Configure custom domain if needed

### Manual Deployment
1. **Build**: `npm run build`
2. **Upload**: Upload `dist/` folder to your hosting provider
3. **Configure**: Set up routing for Single Page Application

## 📈 Analytics & Monitoring

### Built-in Analytics
- User progress tracking
- Performance metrics
- Usage patterns
- Achievement unlocks

### Performance Monitoring
- Page load times
- Bundle size analysis
- Memory usage tracking
- Error reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LeetCode** for providing the problem database structure
- **React Team** for the excellent framework
- **Vite** for the fast build tool
- **Vercel** for seamless deployment

## 📞 Support

For support, feature requests, or bug reports:
- Create an issue on GitHub
- Email: support@leetcodequizmaster.com
- Discord: [Community Server](https://discord.gg/leetcode-quiz-master)

---

**🎯 Master your coding interviews with LeetCode Quiz Master!**

*Built with ❤️ for the coding community*