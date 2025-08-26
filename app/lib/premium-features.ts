export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  category: 'analytics' | 'practice' | 'social' | 'learning' | 'tools';
  tier: 'premium' | 'pro' | 'enterprise';
  isEnabled: boolean;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    yearlyDiscount: number;
  };
  features: string[];
  limits: {
    problemsPerMonth?: number;
    analyticsHistory?: number; // days
    customQuizzes?: number;
    studyGroups?: number;
    aiRecommendations?: number;
    codeExecution?: number;
    prioritySupport: boolean;
  };
  popular?: boolean;
}

export interface UserSubscription {
  userId: string;
  tier: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: string;
  usage: {
    problemsSolved: number;
    analyticsAccessed: number;
    customQuizzes: number;
    aiRecommendations: number;
    codeExecutions: number;
  };
}

export interface PremiumAnalytics {
  detailedProgress: {
    categoryTrends: Array<{
      category: string;
      trend: 'improving' | 'stable' | 'declining';
      change: number;
    }>;
    algorithmMastery: Map<string, {
      level: number;
      timeSpent: number;
      problemsSolved: number;
      averageAttempts: number;
    }>;
    difficultyProgression: {
      easy: { accuracy: number; avgTime: number; trend: string };
      medium: { accuracy: number; avgTime: number; trend: string };
      hard: { accuracy: number; avgTime: number; trend: string };
    };
    predictedPerformance: {
      nextWeekEstimate: number;
      confidenceLevel: number;
      recommendations: string[];
    };
  };
  customReports: Array<{
    id: string;
    name: string;
    type: 'weekly' | 'monthly' | 'custom';
    metrics: string[];
    schedule: string;
    format: 'pdf' | 'json' | 'csv';
  }>;
}

export class PremiumService {
  private subscriptionTiers: SubscriptionTier[] = [];
  private premiumFeatures: PremiumFeature[] = [];
  private userSubscriptions: Map<string, UserSubscription> = new Map();

  constructor() {
    this.initializeSubscriptionTiers();
    this.initializePremiumFeatures();
  }

  private initializeSubscriptionTiers() {
    this.subscriptionTiers = [
      {
        id: 'free',
        name: 'Free',
        description: 'Perfect for getting started with coding practice',
        price: { monthly: 0, yearly: 0, yearlyDiscount: 0 },
        features: [
          'Access to 100+ problems',
          'Basic analytics',
          'Community features',
          'Daily challenges',
          'Basic achievements'
        ],
        limits: {
          problemsPerMonth: 50,
          analyticsHistory: 7,
          customQuizzes: 2,
          studyGroups: 2,
          aiRecommendations: 10,
          codeExecution: 100,
          prioritySupport: false
        }
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'Enhanced learning with advanced features',
        price: { monthly: 9.99, yearly: 99.99, yearlyDiscount: 17 },
        features: [
          'Access to 1000+ problems',
          'Advanced analytics & insights',
          'Unlimited custom quizzes',
          'AI-powered recommendations',
          'Code execution & testing',
          'Premium study groups',
          'Interview preparation tools',
          'Detailed progress tracking'
        ],
        limits: {
          problemsPerMonth: 500,
          analyticsHistory: 90,
          customQuizzes: 20,
          studyGroups: 10,
          aiRecommendations: 100,
          codeExecution: 1000,
          prioritySupport: false
        },
        popular: true
      },
      {
        id: 'pro',
        name: 'Pro',
        description: 'For serious competitive programmers',
        price: { monthly: 19.99, yearly: 199.99, yearlyDiscount: 17 },
        features: [
          'Everything in Premium',
          'Unlimited problems',
          'Advanced code analysis',
          'Performance prediction',
          'Custom learning paths',
          'Mock interviews',
          '1-on-1 mentoring sessions',
          'Priority support',
          'Beta feature access'
        ],
        limits: {
          analyticsHistory: 365,
          prioritySupport: true
        }
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For teams and organizations',
        price: { monthly: 49.99, yearly: 499.99, yearlyDiscount: 17 },
        features: [
          'Everything in Pro',
          'Team management',
          'Advanced reporting',
          'Custom integrations',
          'Dedicated account manager',
          'SLA guarantee',
          'Custom branding',
          'API access'
        ],
        limits: {
          analyticsHistory: 999,
          prioritySupport: true
        }
      }
    ];
  }

  private initializePremiumFeatures() {
    this.premiumFeatures = [
      // Analytics Features
      {
        id: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'Detailed performance insights with trends and predictions',
        category: 'analytics',
        tier: 'premium',
        isEnabled: false
      },
      {
        id: 'custom-reports',
        name: 'Custom Reports',
        description: 'Generate personalized progress reports',
        category: 'analytics',
        tier: 'premium',
        isEnabled: false
      },
      {
        id: 'performance-prediction',
        name: 'Performance Prediction',
        description: 'AI-powered performance forecasting',
        category: 'analytics',
        tier: 'pro',
        isEnabled: false
      },
      {
        id: 'competitor-analysis',
        name: 'Competitor Analysis',
        description: 'Compare your progress with similar users',
        category: 'analytics',
        tier: 'pro',
        isEnabled: false
      },

      // Practice Features
      {
        id: 'unlimited-problems',
        name: 'Unlimited Problems',
        description: 'Access to entire problem database',
        category: 'practice',
        tier: 'pro',
        isEnabled: false
      },
      {
        id: 'custom-difficulty',
        name: 'Custom Difficulty',
        description: 'Adaptive difficulty based on your skill level',
        category: 'practice',
        tier: 'premium',
        isEnabled: false
      },
      {
        id: 'mock-interviews',
        name: 'Mock Interviews',
        description: 'Practice coding interviews with AI feedback',
        category: 'practice',
        tier: 'pro',
        isEnabled: false
      },
      {
        id: 'code-review',
        name: 'AI Code Review',
        description: 'Get detailed feedback on your solutions',
        category: 'practice',
        tier: 'premium',
        isEnabled: false
      },

      // Social Features
      {
        id: 'private-groups',
        name: 'Private Study Groups',
        description: 'Create invite-only study groups',
        category: 'social',
        tier: 'premium',
        isEnabled: false
      },
      {
        id: 'mentoring',
        name: '1-on-1 Mentoring',
        description: 'Personal mentoring sessions with experts',
        category: 'social',
        tier: 'pro',
        isEnabled: false
      },
      {
        id: 'team-management',
        name: 'Team Management',
        description: 'Manage and track team progress',
        category: 'social',
        tier: 'enterprise',
        isEnabled: false
      },

      // Learning Features
      {
        id: 'custom-learning-paths',
        name: 'Custom Learning Paths',
        description: 'Personalized curriculum based on your goals',
        category: 'learning',
        tier: 'premium',
        isEnabled: false
      },
      {
        id: 'ai-tutor',
        name: 'AI Tutor',
        description: 'Personal AI assistant for coding help',
        category: 'learning',
        tier: 'pro',
        isEnabled: false
      },
      {
        id: 'video-solutions',
        name: 'Video Solutions',
        description: 'Detailed video explanations for problems',
        category: 'learning',
        tier: 'premium',
        isEnabled: false
      },

      // Tools Features
      {
        id: 'advanced-editor',
        name: 'Advanced Code Editor',
        description: 'IDE-like features with debugging tools',
        category: 'tools',
        tier: 'premium',
        isEnabled: false
      },
      {
        id: 'api-access',
        name: 'API Access',
        description: 'Integrate with external tools and systems',
        category: 'tools',
        tier: 'enterprise',
        isEnabled: false
      },
      {
        id: 'offline-mode',
        name: 'Offline Mode',
        description: 'Practice coding without internet connection',
        category: 'tools',
        tier: 'pro',
        isEnabled: false
      }
    ];
  }

  // Subscription management
  getSubscriptionTiers(): SubscriptionTier[] {
    return this.subscriptionTiers;
  }

  getUserSubscription(userId: string): UserSubscription | null {
    return this.userSubscriptions.get(userId) || null;
  }

  isFeatureAvailable(userId: string, featureId: string): boolean {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) return false;

    const feature = this.premiumFeatures.find(f => f.id === featureId);
    if (!feature) return false;

    const userTier = subscription.tier;
    const requiredTier = feature.tier;

    // Check tier hierarchy: free < premium < pro < enterprise
    const tierHierarchy = ['free', 'premium', 'pro', 'enterprise'];
    const userTierIndex = tierHierarchy.indexOf(userTier);
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);

    return userTierIndex >= requiredTierIndex;
  }

  checkUsageLimits(userId: string, feature: string): {
    allowed: boolean;
    used: number;
    limit: number;
    resetDate?: Date;
  } {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) {
      return { allowed: false, used: 0, limit: 0 };
    }

    const tier = this.subscriptionTiers.find(t => t.id === subscription.tier);
    if (!tier) {
      return { allowed: false, used: 0, limit: 0 };
    }

    const limits = tier.limits;
    const usage = subscription.usage;

    switch (feature) {
      case 'problems':
        return {
          allowed: !limits.problemsPerMonth || usage.problemsSolved < limits.problemsPerMonth,
          used: usage.problemsSolved,
          limit: limits.problemsPerMonth || Infinity,
          resetDate: this.getMonthlyResetDate()
        };

      case 'analytics':
        return {
          allowed: !limits.analyticsHistory || usage.analyticsAccessed < limits.analyticsHistory,
          used: usage.analyticsAccessed,
          limit: limits.analyticsHistory || Infinity
        };

      case 'customQuizzes':
        return {
          allowed: !limits.customQuizzes || usage.customQuizzes < limits.customQuizzes,
          used: usage.customQuizzes,
          limit: limits.customQuizzes || Infinity,
          resetDate: this.getMonthlyResetDate()
        };

      case 'aiRecommendations':
        return {
          allowed: !limits.aiRecommendations || usage.aiRecommendations < limits.aiRecommendations,
          used: usage.aiRecommendations,
          limit: limits.aiRecommendations || Infinity,
          resetDate: this.getMonthlyResetDate()
        };

      case 'codeExecution':
        return {
          allowed: !limits.codeExecution || usage.codeExecutions < limits.codeExecution,
          used: usage.codeExecutions,
          limit: limits.codeExecution || Infinity,
          resetDate: this.getMonthlyResetDate()
        };

      default:
        return { allowed: true, used: 0, limit: Infinity };
    }
  }

  private getMonthlyResetDate(): Date {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth;
  }

  // Premium analytics
  generatePremiumAnalytics(userId: string): PremiumAnalytics | null {
    if (!this.isFeatureAvailable(userId, 'advanced-analytics')) {
      return null;
    }

    // Mock premium analytics data
    return {
      detailedProgress: {
        categoryTrends: [
          { category: 'Dynamic Programming', trend: 'improving', change: 15.3 },
          { category: 'Graph Algorithms', trend: 'stable', change: 2.1 },
          { category: 'Array Manipulation', trend: 'declining', change: -5.7 }
        ],
        algorithmMastery: new Map([
          ['Two Pointers', { level: 85, timeSpent: 120, problemsSolved: 23, averageAttempts: 1.4 }],
          ['Binary Search', { level: 72, timeSpent: 95, problemsSolved: 18, averageAttempts: 2.1 }],
          ['Dynamic Programming', { level: 45, timeSpent: 180, problemsSolved: 12, averageAttempts: 3.2 }]
        ]),
        difficultyProgression: {
          easy: { accuracy: 92.5, avgTime: 8.3, trend: 'stable' },
          medium: { accuracy: 74.2, avgTime: 23.7, trend: 'improving' },
          hard: { accuracy: 45.1, avgTime: 47.8, trend: 'improving' }
        },
        predictedPerformance: {
          nextWeekEstimate: 78.5,
          confidenceLevel: 85,
          recommendations: [
            'Focus on Dynamic Programming problems',
            'Practice more Hard difficulty problems',
            'Review graph algorithms concepts'
          ]
        }
      },
      customReports: [
        {
          id: 'weekly-summary',
          name: 'Weekly Progress Summary',
          type: 'weekly',
          metrics: ['problems_solved', 'accuracy', 'time_spent'],
          schedule: 'Every Sunday at 9:00 AM',
          format: 'pdf'
        }
      ]
    };
  }

  // Feature enablement
  enableFeature(userId: string, featureId: string): boolean {
    if (!this.isFeatureAvailable(userId, featureId)) {
      return false;
    }

    const feature = this.premiumFeatures.find(f => f.id === featureId);
    if (feature) {
      feature.isEnabled = true;
      return true;
    }

    return false;
  }

  // Subscription upgrade/downgrade
  upgradeSubscription(userId: string, newTierId: string): boolean {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) return false;

    const newTier = this.subscriptionTiers.find(t => t.id === newTierId);
    if (!newTier) return false;

    subscription.tier = newTierId;
    subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    return true;
  }

  // Trial management
  startFreeTrial(userId: string): boolean {
    const existingSubscription = this.getUserSubscription(userId);
    if (existingSubscription) return false;

    const trialSubscription: UserSubscription = {
      userId,
      tier: 'premium',
      status: 'trial',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
      autoRenew: false,
      paymentMethod: 'trial',
      usage: {
        problemsSolved: 0,
        analyticsAccessed: 0,
        customQuizzes: 0,
        aiRecommendations: 0,
        codeExecutions: 0
      }
    };

    this.userSubscriptions.set(userId, trialSubscription);
    return true;
  }

  // Usage tracking
  trackUsage(userId: string, feature: string, amount: number = 1): boolean {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) return false;

    switch (feature) {
      case 'problems':
        subscription.usage.problemsSolved += amount;
        break;
      case 'analytics':
        subscription.usage.analyticsAccessed += amount;
        break;
      case 'customQuizzes':
        subscription.usage.customQuizzes += amount;
        break;
      case 'aiRecommendations':
        subscription.usage.aiRecommendations += amount;
        break;
      case 'codeExecution':
        subscription.usage.codeExecutions += amount;
        break;
    }

    return true;
  }

  // Feature comparison
  compareFeatures(currentTier: string, targetTier: string): {
    newFeatures: string[];
    upgradedLimits: { [key: string]: { current: number | boolean; new: number | boolean } };
  } {
    const current = this.subscriptionTiers.find(t => t.id === currentTier);
    const target = this.subscriptionTiers.find(t => t.id === targetTier);

    if (!current || !target) {
      return { newFeatures: [], upgradedLimits: {} };
    }

    const newFeatures = target.features.filter(f => !current.features.includes(f));
    const upgradedLimits: { [key: string]: { current: number | boolean; new: number | boolean } } = {};

    // Compare limits
    Object.keys(target.limits).forEach(key => {
      const currentValue = (current.limits as any)[key];
      const targetValue = (target.limits as any)[key];
      
      if (currentValue !== targetValue) {
        upgradedLimits[key] = { current: currentValue, new: targetValue };
      }
    });

    return { newFeatures, upgradedLimits };
  }
}

export const premiumService = new PremiumService();