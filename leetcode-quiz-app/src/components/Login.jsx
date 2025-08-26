import { useState } from 'react';

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      alert('Please enter a username');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (isRegistering) {
      // Registration
      const existingUser = users.find(u => u.username === formData.username);
      if (existingUser) {
        alert('Username already exists. Please choose a different one.');
        return;
      }
      
      const newUser = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        totalXP: 0,
        scores: [],
        joinDate: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      onLogin(newUser);
    } else {
      // Login
      const user = users.find(u => 
        u.username === formData.username && u.password === formData.password
      );
      
      if (user) {
        onLogin(user);
      } else {
        alert('Invalid username or password');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎯 LeetCode Quiz Master</h1>
          <p>Master coding interviews with 3,662+ problems</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>{isRegistering ? 'Create Account' : 'Sign In'}</h2>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label htmlFor="email">Email (optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="login-switch">
          <p>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={switchMode} className="switch-btn">
              {isRegistering ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>

        <div className="demo-accounts">
          <h3>🚀 Quick Start</h3>
          <p>Try these demo accounts or create your own:</p>
          <div className="demo-buttons">
            <button 
              onClick={() => onLogin({
                id: 'demo-beginner',
                username: 'Demo Beginner',
                totalXP: 250,
                scores: []
              })}
              className="demo-btn beginner"
            >
              👶 Beginner (Level 1)
            </button>
            <button 
              onClick={() => onLogin({
                id: 'demo-intermediate',
                username: 'Demo Intermediate',
                totalXP: 5500,
                scores: []
              })}
              className="demo-btn intermediate"
            >
              🎯 Intermediate (Level 6)
            </button>
            <button 
              onClick={() => onLogin({
                id: 'demo-expert',
                username: 'Demo Expert',
                totalXP: 12000,
                scores: []
              })}
              className="demo-btn expert"
            >
              🏆 Expert (Level 13)
            </button>
          </div>
        </div>

        <div className="features-preview">
          <h3>✨ What's Included</h3>
          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>3,662+ LeetCode Problems</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🏢</span>
              <span>Company Interview Prep</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Algorithm Mastery Tracking</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🏆</span>
              <span>Achievements & Leaderboards</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📚</span>
              <span>Structured Study Plans</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📈</span>
              <span>Performance Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;