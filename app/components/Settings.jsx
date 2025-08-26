import { useState, useEffect } from 'react';

function Settings({ user, onUpdateUser }) {
  const [settings, setSettings] = useState({
    // User Profile
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    
    // Quiz Preferences
    defaultDifficulty: 'Mixed',
    defaultQuestionCount: 10,
    defaultTimeLimit: 600,
    showHints: true,
    autoSubmit: false,
    skipCorrectAnswers: false,
    
    // Display Preferences
    theme: 'light',
    fontSize: 'medium',
    showAnimations: true,
    compactMode: false,
    showProgressBar: true,
    
    // Notification Settings
    dailyReminder: true,
    streakNotifications: true,
    weeklyReport: true,
    achievementNotifications: true,
    emailNotifications: false,
    
    // Privacy Settings
    showProfilePublic: true,
    showStatsPublic: true,
    allowDataExport: true,
    
    // Study Settings
    studyReminders: true,
    focusTime: 25, // Pomodoro timer
    breakTime: 5,
    goalProblemsPerDay: 2,
    preferredStudyTime: '18:00'
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isDirty, setIsDirty] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(`userSettings_${user?.id}`);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
    }
  }, [user?.id]);

  // Apply theme changes immediately
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[settings.fontSize];
  }, [settings.theme, settings.fontSize]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const saveSettings = () => {
    // Save to localStorage
    localStorage.setItem(`userSettings_${user?.id}`, JSON.stringify(settings));
    
    // Update user profile if needed
    if (settings.name !== user?.name || settings.email !== user?.email) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { 
          ...users[userIndex], 
          name: settings.name,
          email: settings.email,
          avatar: settings.avatar
        };
        localStorage.setItem('users', JSON.stringify(users));
        onUpdateUser(users[userIndex]);
      }
    }
    
    setIsDirty(false);
    
    // Show success message
    const notification = document.createElement('div');
    notification.className = 'settings-notification success';
    notification.textContent = 'Settings saved successfully!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const resetSettings = () => {
    const defaultSettings = {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      defaultDifficulty: 'Mixed',
      defaultQuestionCount: 10,
      defaultTimeLimit: 600,
      showHints: true,
      autoSubmit: false,
      skipCorrectAnswers: false,
      theme: 'light',
      fontSize: 'medium',
      showAnimations: true,
      compactMode: false,
      showProgressBar: true,
      dailyReminder: true,
      streakNotifications: true,
      weeklyReport: true,
      achievementNotifications: true,
      emailNotifications: false,
      showProfilePublic: true,
      showStatsPublic: true,
      allowDataExport: true,
      studyReminders: true,
      focusTime: 25,
      breakTime: 5,
      goalProblemsPerDay: 2,
      preferredStudyTime: '18:00'
    };
    setSettings(defaultSettings);
    setIsDirty(true);
  };

  const exportData = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.id === user.id);
    
    const exportData = {
      profile: {
        name: currentUser?.name,
        email: currentUser?.email,
        joinDate: currentUser?.joinDate,
        totalXP: currentUser?.totalXP
      },
      stats: {
        scores: currentUser?.scores || [],
        studyPlans: currentUser?.studyPlans || {},
        customStudyPlans: currentUser?.customStudyPlans || {}
      },
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leetcode-quiz-data-${user.name.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      localStorage.removeItem(`userSettings_${user.id}`);
      
      // Redirect to login or home page
      window.location.href = '/';
    }
  };

  const SettingItem = ({ label, description, children, type = 'default' }) => (
    <div className={`setting-item ${type}`}>
      <div className="setting-info">
        <label className="setting-label">{label}</label>
        {description && <p className="setting-description">{description}</p>}
      </div>
      <div className="setting-control">
        {children}
      </div>
    </div>
  );

  const TabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="settings-section">
            <h2>👤 Profile Settings</h2>
            
            <SettingItem 
              label="Display Name" 
              description="Your name as shown to other users"
            >
              <input
                type="text"
                value={settings.name}
                onChange={(e) => handleSettingChange('name', e.target.value)}
                className="setting-input"
              />
            </SettingItem>

            <SettingItem 
              label="Email" 
              description="Your email address (private)"
            >
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
                className="setting-input"
              />
            </SettingItem>

            <SettingItem 
              label="Avatar" 
              description="Profile picture URL (optional)"
            >
              <input
                type="url"
                value={settings.avatar}
                onChange={(e) => handleSettingChange('avatar', e.target.value)}
                className="setting-input"
                placeholder="https://example.com/avatar.jpg"
              />
            </SettingItem>

            <div className="profile-preview">
              <h3>Profile Preview</h3>
              <div className="preview-card">
                <div className="preview-avatar">
                  {settings.avatar ? (
                    <img src={settings.avatar} alt="Avatar" />
                  ) : (
                    <div className="default-avatar">
                      {settings.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="preview-info">
                  <h4>{settings.name}</h4>
                  <p>Level {Math.floor((user?.totalXP || 0) / 1000) + 1}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="settings-section">
            <h2>🎯 Quiz Preferences</h2>
            
            <SettingItem 
              label="Default Difficulty" 
              description="Default difficulty for new quizzes"
            >
              <select
                value={settings.defaultDifficulty}
                onChange={(e) => handleSettingChange('defaultDifficulty', e.target.value)}
                className="setting-select"
              >
                <option value="Mixed">Mixed</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </SettingItem>

            <SettingItem 
              label="Default Question Count" 
              description="Number of questions per quiz"
            >
              <select
                value={settings.defaultQuestionCount}
                onChange={(e) => handleSettingChange('defaultQuestionCount', parseInt(e.target.value))}
                className="setting-select"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </SettingItem>

            <SettingItem 
              label="Default Time Limit" 
              description="Time limit for quizzes (in minutes)"
            >
              <select
                value={settings.defaultTimeLimit}
                onChange={(e) => handleSettingChange('defaultTimeLimit', parseInt(e.target.value))}
                className="setting-select"
              >
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
                <option value={900}>15 minutes</option>
                <option value={1200}>20 minutes</option>
                <option value={1800}>30 minutes</option>
              </select>
            </SettingItem>

            <SettingItem 
              label="Show Hints" 
              description="Display algorithm hints during quizzes"
            >
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showHints}
                  onChange={(e) => handleSettingChange('showHints', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </SettingItem>

            <SettingItem 
              label="Auto Submit" 
              description="Automatically submit quiz when time runs out"
            >
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoSubmit}
                  onChange={(e) => handleSettingChange('autoSubmit', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </SettingItem>
          </div>
        );

      case 'display':
        return (
          <div className="settings-section">
            <h2>🎨 Display Settings</h2>
            
            <SettingItem 
              label="Theme" 
              description="Choose your preferred color scheme"
            >
              <div className="theme-selector">
                <button
                  className={`theme-option light ${settings.theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleSettingChange('theme', 'light')}
                >
                  ☀️ Light
                </button>
                <button
                  className={`theme-option dark ${settings.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleSettingChange('theme', 'dark')}
                >
                  🌙 Dark
                </button>
              </div>
            </SettingItem>

            <SettingItem 
              label="Font Size" 
              description="Adjust text size for better readability"
            >
              <div className="font-size-selector">
                <button
                  className={`size-option ${settings.fontSize === 'small' ? 'active' : ''}`}
                  onClick={() => handleSettingChange('fontSize', 'small')}
                >
                  Small
                </button>
                <button
                  className={`size-option ${settings.fontSize === 'medium' ? 'active' : ''}`}
                  onClick={() => handleSettingChange('fontSize', 'medium')}
                >
                  Medium
                </button>
                <button
                  className={`size-option ${settings.fontSize === 'large' ? 'active' : ''}`}
                  onClick={() => handleSettingChange('fontSize', 'large')}
                >
                  Large
                </button>
              </div>
            </SettingItem>

            <SettingItem 
              label="Animations" 
              description="Enable smooth animations and transitions"
            >
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showAnimations}
                  onChange={(e) => handleSettingChange('showAnimations', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </SettingItem>

            <SettingItem 
              label="Compact Mode" 
              description="Reduce spacing for more content on screen"
            >
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </SettingItem>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-section">
            <h2>🔔 Notifications</h2>
            
            <SettingItem 
              label="Daily Reminders" 
              description="Get daily reminders to practice coding"
            >
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.dailyReminder}
                  onChange={(e) => handleSettingChange('dailyReminder', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </SettingItem>

            <SettingItem 
              label="Streak Notifications" 
              description="Get notified about your coding streak"
            >
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.streakNotifications}
                  onChange={(e) => handleSettingChange('streakNotifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </SettingItem>

            <SettingItem 
              label="Achievement Notifications" 
              description="Get notified when you earn new achievements"
            >
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.achievementNotifications}
                  onChange={(e) => handleSettingChange('achievementNotifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </SettingItem>

            <SettingItem 
              label="Weekly Reports" 
              description="Receive weekly progress reports"
            >
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.weeklyReport}
                  onChange={(e) => handleSettingChange('weeklyReport', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </SettingItem>

            <SettingItem 
              label="Preferred Study Time" 
              description="When would you like to receive study reminders?"
            >
              <input
                type="time"
                value={settings.preferredStudyTime}
                onChange={(e) => handleSettingChange('preferredStudyTime', e.target.value)}
                className="setting-input"
              />
            </SettingItem>
          </div>
        );

      case 'privacy':
        return (
          <div className="settings-section">
            <h2>🔒 Privacy & Data</h2>
            
            <SettingItem 
              label="Public Profile" 
              description="Allow others to view your profile"
            >
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showProfilePublic}
                  onChange={(e) => handleSettingChange('showProfilePublic', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </SettingItem>

            <SettingItem 
              label="Public Statistics" 
              description="Show your stats on leaderboards"
            >
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showStatsPublic}
                  onChange={(e) => handleSettingChange('showStatsPublic', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </SettingItem>

            <SettingItem 
              label="Data Export" 
              description="Export your data for backup or transfer" 
              type="action"
            >
              <button className="action-btn secondary" onClick={exportData}>
                📥 Export Data
              </button>
            </SettingItem>

            <SettingItem 
              label="Delete Account" 
              description="Permanently delete your account and all data" 
              type="danger"
            >
              <button className="action-btn danger" onClick={deleteAccount}>
                🗑️ Delete Account
              </button>
            </SettingItem>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Customize your coding experience</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button 
              className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              🎯 Quiz
            </button>
            <button 
              className={`tab-btn ${activeTab === 'display' ? 'active' : ''}`}
              onClick={() => setActiveTab('display')}
            >
              🎨 Display
            </button>
            <button 
              className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              🔔 Notifications
            </button>
            <button 
              className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              🔒 Privacy
            </button>
          </div>
        </div>

        <div className="settings-content">
          <TabContent />
        </div>
      </div>

      <div className="settings-actions">
        <button 
          className="action-btn secondary" 
          onClick={resetSettings}
        >
          🔄 Reset to Defaults
        </button>
        <button 
          className="action-btn primary" 
          onClick={saveSettings}
          disabled={!isDirty}
        >
          💾 Save Changes
        </button>
      </div>

      {isDirty && (
        <div className="unsaved-changes-notice">
          ⚠️ You have unsaved changes
        </div>
      )}
    </div>
  );
}

export default Settings;