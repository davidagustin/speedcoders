import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '@/app/components/Dashboard';
import { ComponentTestUtils, createMockUser, createMockQuizResult } from '@/lib/testing/TestUtils';
import { PerformanceMonitor } from '@/lib/PerformanceMonitor';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock performance monitor
jest.mock('@/lib/PerformanceMonitor', () => ({
  PerformanceMonitor: {
    getInstance: () => ({
      markStart: jest.fn(),
      markEnd: jest.fn(),
      getVitals: jest.fn(() => ({})),
    }),
  },
}));

describe('Dashboard Component', () => {
  const mockUser = createMockUser({
    username: 'TestUser',
    totalXP: 2500,
    scores: [
      createMockQuizResult({ percentage: 80, difficulty: 'Easy', correct: 8, totalQuestions: 10 }),
      createMockQuizResult({ percentage: 70, difficulty: 'Medium', correct: 7, totalQuestions: 10 }),
      createMockQuizResult({ percentage: 60, difficulty: 'Hard', correct: 6, totalQuestions: 10 }),
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn((key: string) => {
        if (key === 'users') {
          return JSON.stringify([mockUser]);
        }
        if (key.startsWith('dailyChallenge_')) {
          return JSON.stringify({
            title: 'Test Challenge',
            description: 'Complete a test quiz',
            difficulty: 'Medium',
            reward: '500 XP',
            icon: '🎯',
            type: 'accuracy',
          });
        }
        return null;
      }),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard with user information', async () => {
    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, TestUser!/)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Ready to conquer more algorithms\?/)).toBeInTheDocument();
  });

  it('displays correct user level and XP', async () => {
    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('Level 3')).toBeInTheDocument();
      expect(screen.getByText('2500 XP')).toBeInTheDocument();
    });
  });

  it('shows user statistics correctly', async () => {
    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      // Should show total problems solved (30 from 3 quizzes with 10 questions each)
      expect(screen.getByText('30')).toBeInTheDocument();
      
      // Should show average accuracy
      expect(screen.getByText(/70%/)).toBeInTheDocument();
    });
  });

  it('displays daily challenge when available', async () => {
    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('🎯 Daily Challenge')).toBeInTheDocument();
      expect(screen.getByText('Test Challenge')).toBeInTheDocument();
      expect(screen.getByText('Complete a test quiz')).toBeInTheDocument();
      expect(screen.getByText('500 XP')).toBeInTheDocument();
    });
  });

  it('handles quiz start navigation correctly', async () => {
    const user = userEvent.setup();
    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('Smart Quiz')).toBeInTheDocument();
    });
    
    const smartQuizButton = screen.getByRole('button', { name: /Smart Quiz/ });
    await user.click(smartQuizButton);
    
    expect(mockPush).toHaveBeenCalledWith('/quiz?mode=smart');
  });

  it('renders loading state initially', () => {
    // Test with a user that has no scores to trigger loading state
    const emptyUser = createMockUser({ scores: [] });
    render(<Dashboard user={emptyUser} />);
    
    expect(screen.getByText(/Loading dashboard.../)).toBeInTheDocument();
  });

  it('handles error state gracefully', async () => {
    // Mock localStorage to throw an error
    const errorLocalStorage = {
      getItem: jest.fn(() => {
        throw new Error('Storage error');
      }),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: errorLocalStorage });
    
    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  it('calculates algorithm mastery correctly', async () => {
    const userWithDetailedScores = createMockUser({
      scores: [
        {
          ...createMockQuizResult(),
          details: [
            {
              question: 'Test Question',
              questionId: '1',
              difficulty: 'Easy',
              userAnswer: ['Array', 'Hash Table'],
              correctAnswer: ['Array', 'Hash Table'],
              allAlgorithms: ['Array', 'Hash Table', 'Two Pointers'],
              isCorrect: true,
              url: 'https://test.com',
            },
            {
              question: 'Test Question 2',
              questionId: '2',
              difficulty: 'Medium',
              userAnswer: ['Dynamic Programming'],
              correctAnswer: ['Dynamic Programming', 'Greedy'],
              allAlgorithms: ['Dynamic Programming', 'Greedy'],
              isCorrect: false,
              url: 'https://test.com',
            },
          ],
        },
      ],
    });

    render(<Dashboard user={userWithDetailedScores} />);
    
    await waitFor(() => {
      expect(screen.getByText('🎯 Top Algorithm Mastery')).toBeInTheDocument();
    });
  });

  it('navigates to algorithms page when view all is clicked', async () => {
    const user = userEvent.setup();
    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('View All Algorithms →')).toBeInTheDocument();
    });
    
    const viewAllButton = screen.getByRole('button', { name: /View All Algorithms/ });
    await user.click(viewAllButton);
    
    expect(mockPush).toHaveBeenCalledWith('/algorithms');
  });

  it('accepts daily challenge and starts appropriate quiz', async () => {
    const user = userEvent.setup();
    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('Accept Challenge')).toBeInTheDocument();
    });
    
    const challengeButton = screen.getByRole('button', { name: /Accept Challenge/ });
    await user.click(challengeButton);
    
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/quiz'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('mode=challenge'));
  });

  it('measures performance using PerformanceMonitor', async () => {
    const mockMarkStart = jest.fn();
    const mockMarkEnd = jest.fn();
    
    (PerformanceMonitor.getInstance as jest.Mock).mockReturnValue({
      markStart: mockMarkStart,
      markEnd: mockMarkEnd,
      getVitals: jest.fn(() => ({})),
    });

    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, TestUser!/)).toBeInTheDocument();
    });
    
    expect(mockMarkStart).toHaveBeenCalledWith('calculateUserStats');
    expect(mockMarkEnd).toHaveBeenCalledWith('calculateUserStats');
  });

  it('handles empty user data gracefully', async () => {
    const emptyUser = createMockUser({
      scores: [],
      totalXP: 0,
    });

    render(<Dashboard user={emptyUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('0 XP')).toBeInTheDocument();
      expect(screen.getByText('0 days')).toBeInTheDocument(); // Streak
    });
  });

  it('renders all quick action cards', async () => {
    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('Smart Quiz')).toBeInTheDocument();
      expect(screen.getByText('Company Focus')).toBeInTheDocument();
      expect(screen.getByText('Algorithm Deep Dive')).toBeInTheDocument();
      expect(screen.getByText('Speed Challenge')).toBeInTheDocument();
      expect(screen.getByText('Hard Problems')).toBeInTheDocument();
      expect(screen.getByText('Review Mistakes')).toBeInTheDocument();
    });
  });

  it('displays weekly progress chart', async () => {
    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('Weekly Activity')).toBeInTheDocument();
      expect(screen.getByText('📊 Your Progress')).toBeInTheDocument();
    });
  });

  it('displays difficulty breakdown chart', async () => {
    render(<Dashboard user={mockUser} />);
    
    await waitFor(() => {
      expect(screen.getByText('Difficulty Distribution')).toBeInTheDocument();
      expect(screen.getByText('Easy')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Hard')).toBeInTheDocument();
    });
  });
});