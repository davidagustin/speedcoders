import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Results from './components/Results';
import ProblemBrowser from './components/ProblemBrowser';
import Analytics from './components/Analytics';
import CompanyMode from './components/CompanyMode';
import AlgorithmMastery from './components/AlgorithmMastery';
import StudyPlans from './components/StudyPlans';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';

function App() {
  const [user, setUser] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setQuizResults(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Router>
      <div className={`app theme-${theme}`}>
        {user && (
          <nav className="enhanced-navbar">
            <div className="navbar-brand">
              <Link to="/dashboard" className="brand-link">
                <span className="brand-icon">🧠</span>
                <span className="brand-text">LeetCode Master</span>
                <span className="brand-badge">3,662 Problems</span>
              </Link>
            </div>
            
            <div className="navbar-menu">
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon">📊</span>Dashboard
              </Link>
              <Link to="/problems" className="nav-link">
                <span className="nav-icon">🔍</span>Problems
              </Link>
              <Link to="/quiz" className="nav-link">
                <span className="nav-icon">⚡</span>Quiz
              </Link>
              <Link to="/analytics" className="nav-link">
                <span className="nav-icon">📈</span>Analytics
              </Link>
              <Link to="/company" className="nav-link">
                <span className="nav-icon">🏢</span>Companies
              </Link>
              <Link to="/algorithms" className="nav-link">
                <span className="nav-icon">🧮</span>Algorithms
              </Link>
              <Link to="/study-plans" className="nav-link">
                <span className="nav-icon">📚</span>Study Plans
              </Link>
              <Link to="/leaderboard" className="nav-link">
                <span className="nav-icon">🏆</span>Leaderboard
              </Link>
            </div>

            <div className="navbar-user">
              <button onClick={toggleTheme} className="theme-toggle">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <div className="user-info">
                <span className="username">👤 {user.username}</span>
                <div className="user-stats">
                  <span className="user-level">LV.{Math.floor((user.totalXP || 0) / 1000) + 1}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </nav>
        )}
        
        <main className="app-content">
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/problems" 
              element={user ? <ProblemBrowser user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/quiz" 
              element={user ? <Quiz user={user} onComplete={setQuizResults} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/results" 
              element={user && quizResults ? <Results results={quizResults} user={user} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/analytics" 
              element={user ? <Analytics user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/company" 
              element={user ? <CompanyMode user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/algorithms" 
              element={user ? <AlgorithmMastery user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/study-plans" 
              element={user ? <StudyPlans user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/leaderboard" 
              element={user ? <Leaderboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/settings" 
              element={user ? <Settings user={user} /> : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;