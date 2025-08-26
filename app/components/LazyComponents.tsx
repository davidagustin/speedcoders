import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';
import {
  DashboardSkeleton,
  QuizSkeleton,
  AnalyticsSkeleton,
  ProblemBrowserSkeleton,
  CardSkeleton
} from './LoadingSkeletons';

// Lazy load heavy components
const LazyDashboard = lazy(() => 
  import('./Dashboard').then(module => ({ default: module.default }))
);

const LazyQuiz = lazy(() => 
  import('./Quiz').then(module => ({ default: module.default }))
);

const LazyAnalytics = lazy(() => 
  import('./Analytics').then(module => ({ 
    default: module.default 
  })).catch(() => ({
    default: () => <div>Analytics component not found</div>
  }))
);

const LazyAdminDashboard = lazy(() => 
  import('./AdminDashboard').then(module => ({ 
    default: module.default 
  })).catch(() => ({
    default: () => <div>Admin Dashboard not available</div>
  }))
);

const LazyProblemBrowser = lazy(() => 
  import('./ProblemBrowser').then(module => ({ 
    default: module.default 
  })).catch(() => ({
    default: () => <div>Problem Browser not available</div>
  }))
);

const LazyEnhancedDashboard = lazy(() => 
  import('./EnhancedDashboard').then(module => ({ 
    default: module.default 
  })).catch(() => ({
    default: () => <div>Enhanced Dashboard not available</div>
  }))
);

const LazyStudyPlanner = lazy(() => 
  import('./StudyPlanner').then(module => ({ 
    default: module.default 
  })).catch(() => ({
    default: () => <div>Study Planner not available</div>
  }))
);

const LazyQuizCreator = lazy(() => 
  import('./QuizCreator').then(module => ({ 
    default: module.default 
  })).catch(() => ({
    default: () => <div>Quiz Creator not available</div>
  }))
);

// Higher-order component for lazy loading with error boundary and suspense
const withLazyLoading = <P extends object>(
  LazyComponent: React.ComponentType<P>,
  FallbackComponent: React.ComponentType,
  errorLevel: 'page' | 'section' | 'component' = 'section'
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary level={errorLevel}>
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...props} ref={ref} />
      </Suspense>
    </ErrorBoundary>
  ));
};

// Export lazy-loaded components with proper fallbacks
export const Dashboard = withLazyLoading(
  LazyDashboard, 
  DashboardSkeleton, 
  'section'
);

export const Quiz = withLazyLoading(
  LazyQuiz, 
  QuizSkeleton, 
  'section'
);

export const Analytics = withLazyLoading(
  LazyAnalytics, 
  AnalyticsSkeleton, 
  'section'
);

export const AdminDashboard = withLazyLoading(
  LazyAdminDashboard, 
  () => <CardSkeleton lines={5} showImage={true} />, 
  'section'
);

export const ProblemBrowser = withLazyLoading(
  LazyProblemBrowser, 
  ProblemBrowserSkeleton, 
  'section'
);

export const EnhancedDashboard = withLazyLoading(
  LazyEnhancedDashboard, 
  DashboardSkeleton, 
  'section'
);

export const StudyPlanner = withLazyLoading(
  LazyStudyPlanner, 
  () => <CardSkeleton lines={4} showImage={false} />, 
  'component'
);

export const QuizCreator = withLazyLoading(
  LazyQuizCreator, 
  () => <CardSkeleton lines={6} showImage={false} />, 
  'component'
);

// Preload components for better UX
export const preloadComponents = {
  dashboard: () => import('./Dashboard'),
  quiz: () => import('./Quiz'),
  analytics: () => import('./Analytics'),
  adminDashboard: () => import('./AdminDashboard'),
  problemBrowser: () => import('./ProblemBrowser'),
  enhancedDashboard: () => import('./EnhancedDashboard'),
  studyPlanner: () => import('./StudyPlanner'),
  quizCreator: () => import('./QuizCreator'),
};

// Utility function to preload a specific component
export const preloadComponent = (componentName: keyof typeof preloadComponents) => {
  const loadFunction = preloadComponents[componentName];
  if (loadFunction) {
    loadFunction();
  }
};

// Preload all critical components on app initialization
export const preloadCriticalComponents = () => {
  preloadComponent('dashboard');
  preloadComponent('quiz');
};

// Route-based preloading
export const preloadRouteComponents = (route: string) => {
  switch (route) {
    case '/dashboard':
      preloadComponent('dashboard');
      preloadComponent('analytics'); // Preload likely next navigation
      break;
    case '/quiz':
      preloadComponent('quiz');
      break;
    case '/analytics':
      preloadComponent('analytics');
      break;
    case '/admin':
      preloadComponent('adminDashboard');
      break;
    case '/problems':
      preloadComponent('problemBrowser');
      break;
    case '/enhanced-dashboard':
      preloadComponent('enhancedDashboard');
      break;
    case '/study-planner':
      preloadComponent('studyPlanner');
      break;
    default:
      // Preload dashboard as it's the most common entry point
      preloadComponent('dashboard');
  }
};