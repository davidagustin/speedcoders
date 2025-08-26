import React from 'react';

// Base skeleton component
const SkeletonBase: React.FC<{ className?: string; animate?: boolean }> = ({ 
  className = '', 
  animate = true 
}) => (
  <div 
    className={`bg-gray-200 rounded ${animate ? 'animate-pulse' : ''} ${className}`}
    aria-label="Loading..."
  />
);

// Dashboard skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="enhanced-dashboard">
    {/* Header skeleton */}
    <div className="dashboard-header">
      <div className="welcome-section">
        <SkeletonBase className="h-8 w-64 mb-2" />
        <SkeletonBase className="h-4 w-96" />
      </div>
      <div className="level-progress">
        <div className="level-info">
          <SkeletonBase className="h-6 w-16 rounded-full" />
          <SkeletonBase className="h-4 w-12" />
        </div>
        <SkeletonBase className="h-2 w-full mt-2" />
        <SkeletonBase className="h-3 w-24 mt-1" />
      </div>
    </div>

    {/* Daily challenge skeleton */}
    <div className="daily-challenge">
      <div className="challenge-header">
        <SkeletonBase className="h-6 w-32" />
        <SkeletonBase className="h-5 w-16 rounded-full" />
      </div>
      <div className="challenge-content">
        <SkeletonBase className="h-12 w-12 rounded-full" />
        <div className="challenge-details">
          <SkeletonBase className="h-5 w-32 mb-2" />
          <SkeletonBase className="h-4 w-64 mb-1" />
          <SkeletonBase className="h-3 w-16" />
        </div>
        <SkeletonBase className="h-8 w-32 rounded-md" />
      </div>
    </div>

    {/* Metrics grid skeleton */}
    <div className="metrics-grid">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="metric-card">
          <SkeletonBase className="h-8 w-8 rounded-full mb-3" />
          <SkeletonBase className="h-4 w-24 mb-2" />
          <SkeletonBase className="h-6 w-16 mb-1" />
          <SkeletonBase className="h-3 w-20" />
        </div>
      ))}
    </div>

    {/* Quick actions skeleton */}
    <div className="quick-actions">
      <SkeletonBase className="h-6 w-32 mb-4" />
      <div className="action-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="action-card">
            <SkeletonBase className="h-8 w-8 rounded-full mb-3" />
            <SkeletonBase className="h-5 w-32 mb-2" />
            <SkeletonBase className="h-4 w-48" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Quiz skeleton
export const QuizSkeleton: React.FC = () => (
  <div className="enhanced-quiz">
    {/* Quiz header skeleton */}
    <div className="quiz-header">
      <div className="quiz-progress">
        <div className="progress-info">
          <SkeletonBase className="h-4 w-32" />
          <SkeletonBase className="h-6 w-16 rounded-full" />
        </div>
        <SkeletonBase className="h-2 w-full mt-2" />
      </div>
      <div className="quiz-timer">
        <SkeletonBase className="h-6 w-24" />
        <SkeletonBase className="h-1 w-full mt-2" />
      </div>
    </div>

    {/* Question content skeleton */}
    <div className="question-content">
      <div className="problem-card">
        <div className="problem-header">
          <SkeletonBase className="h-6 w-64 mb-2" />
          <SkeletonBase className="h-4 w-32" />
        </div>
        <div className="space-y-2">
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-3/4" />
        </div>
      </div>

      <div className="algorithm-selection">
        <SkeletonBase className="h-5 w-48 mb-4" />
        <div className="algorithm-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SkeletonBase key={i} className="h-10 w-32 rounded-md" />
          ))}
        </div>
      </div>
    </div>

    {/* Navigation skeleton */}
    <div className="quiz-navigation">
      <SkeletonBase className="h-10 w-24" />
      <div className="question-indicators">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <SkeletonBase key={i} className="h-8 w-8 rounded-full" />
        ))}
      </div>
      <SkeletonBase className="h-10 w-24" />
    </div>
  </div>
);

// Analytics skeleton
export const AnalyticsSkeleton: React.FC = () => (
  <div className="analytics-dashboard">
    {/* Header skeleton */}
    <div className="analytics-header">
      <SkeletonBase className="h-8 w-56" />
      <div className="time-range-selector">
        {['Last Week', 'Last Month', 'All Time'].map((period, i) => (
          <SkeletonBase key={i} className="h-8 w-24 rounded-md" />
        ))}
      </div>
    </div>

    {/* Key metrics skeleton */}
    <div className="key-metrics">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="metric-card">
          <SkeletonBase className="h-8 w-8 rounded-full mb-3" />
          <SkeletonBase className="h-4 w-32 mb-2" />
          <SkeletonBase className="h-8 w-16 mb-1" />
          <SkeletonBase className="h-3 w-24" />
        </div>
      ))}
    </div>

    {/* Performance trends skeleton */}
    <div className="performance-trends">
      <SkeletonBase className="h-6 w-40 mb-4" />
      <div className="trend-chart">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="trend-point">
            <SkeletonBase className="h-20 w-8 mb-2" />
            <SkeletonBase className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>

    {/* Difficulty analysis skeleton */}
    <div className="difficulty-analysis">
      <SkeletonBase className="h-6 w-40 mb-4" />
      <div className="difficulty-grid">
        {['Easy', 'Medium', 'Hard'].map((level, i) => (
          <div key={i} className="difficulty-card">
            <SkeletonBase className="h-5 w-16 mb-4" />
            <SkeletonBase className="h-24 w-24 rounded-full mx-auto mb-4" />
            <div className="space-y-2">
              <SkeletonBase className="h-4 w-20" />
              <SkeletonBase className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Algorithm mastery skeleton */}
    <div className="algorithm-mastery">
      <SkeletonBase className="h-6 w-36 mb-4" />
      <div className="mastery-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="mastery-card">
            <div className="mastery-header">
              <SkeletonBase className="h-4 w-24" />
              <SkeletonBase className="h-4 w-4 rounded-full" />
            </div>
            <SkeletonBase className="h-2 w-full my-2" />
            <div className="mastery-stats">
              <SkeletonBase className="h-3 w-16" />
              <SkeletonBase className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Problem browser skeleton
export const ProblemBrowserSkeleton: React.FC = () => (
  <div className="problem-browser">
    {/* Search and filters skeleton */}
    <div className="browser-header">
      <SkeletonBase className="h-10 w-full rounded-md mb-4" />
      <div className="filters-row">
        <SkeletonBase className="h-8 w-24 rounded-md" />
        <SkeletonBase className="h-8 w-32 rounded-md" />
        <SkeletonBase className="h-8 w-28 rounded-md" />
        <SkeletonBase className="h-8 w-36 rounded-md" />
      </div>
    </div>

    {/* Problems list skeleton */}
    <div className="problems-list">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="problem-item">
          <div className="problem-main">
            <SkeletonBase className="h-5 w-8 rounded-full" />
            <div className="problem-details">
              <SkeletonBase className="h-5 w-64 mb-1" />
              <SkeletonBase className="h-3 w-48" />
            </div>
            <SkeletonBase className="h-6 w-16 rounded-full" />
          </div>
          <div className="problem-tags">
            {[1, 2, 3].map((j) => (
              <SkeletonBase key={j} className="h-5 w-20 rounded-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Generic card skeleton
export const CardSkeleton: React.FC<{ 
  lines?: number; 
  showImage?: boolean;
  className?: string;
}> = ({ 
  lines = 3, 
  showImage = false,
  className = '' 
}) => (
  <div className={`bg-white rounded-lg border p-4 ${className}`}>
    {showImage && <SkeletonBase className="h-32 w-full rounded-md mb-4" />}
    <SkeletonBase className="h-5 w-3/4 mb-3" />
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase 
        key={i} 
        className={`h-4 mb-2 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`}
      />
    ))}
  </div>
);

// List item skeleton
export const ListItemSkeleton: React.FC<{ 
  showAvatar?: boolean;
  className?: string;
}> = ({ 
  showAvatar = false,
  className = ''
}) => (
  <div className={`flex items-center space-x-3 p-3 ${className}`}>
    {showAvatar && <SkeletonBase className="h-10 w-10 rounded-full" />}
    <div className="flex-1">
      <SkeletonBase className="h-4 w-3/4 mb-2" />
      <SkeletonBase className="h-3 w-1/2" />
    </div>
    <SkeletonBase className="h-6 w-16 rounded-full" />
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC<{ 
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ 
  rows = 5,
  columns = 4,
  className = ''
}) => (
  <div className={`bg-white rounded-lg border overflow-hidden ${className}`}>
    {/* Header */}
    <div className="border-b p-4">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonBase key={i} className="h-4 w-3/4" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="border-b p-4">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <SkeletonBase key={j} className="h-4 w-2/3" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonBase;