import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'navigation') {
      console.log(`Page load time: ${Math.round(entry.loadEventEnd - entry.fetchStart)}ms`);
    }
  });
});

if (typeof PerformanceObserver !== 'undefined') {
  perfObserver.observe({ entryTypes: ['navigation'] });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);