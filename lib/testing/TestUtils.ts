import { render, screen, fireEvent, waitFor, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';
import { User, QuizResult, Problem, QuizConfig } from '@/types/quiz';

// Mock data generators
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  username: 'testuser',
  email: 'test@example.com',
  scores: [],
  totalXP: 0,
  achievements: [],
  preferences: {
    theme: 'light',
    notifications: true,
    soundEffects: true,
    language: 'en',
  },
  ...overrides,
});

export const createMockQuizResult = (overrides: Partial<QuizResult> = {}): QuizResult => ({
  date: new Date().toISOString(),
  mode: 'smart',
  difficulty: 'Mixed',
  correct: 5,
  totalQuestions: 10,
  percentage: 50,
  timeSpent: 300,
  timeLimit: 600,
  xpEarned: 500,
  details: [],
  ...overrides,
});

export const createMockProblem = (overrides: Partial<Problem> = {}): Problem => ({
  id: '1',
  title: 'Two Sum',
  description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
  difficulty: 'Easy',
  algorithms: ['Hash Table', 'Array', 'Two Pointers'],
  correctAlgorithms: ['Hash Table', 'Array'],
  url: 'https://leetcode.com/problems/two-sum/',
  tags: ['array', 'hash-table'],
  companies: ['Google', 'Amazon'],
  category: 'Array',
  premium: false,
  ...overrides,
});

export const createMockQuizConfig = (overrides: Partial<QuizConfig> = {}): QuizConfig => ({
  mode: 'smart',
  difficulty: 'Mixed',
  timeLimit: 600,
  questionCount: 10,
  algorithms: [],
  company: null,
  ...overrides,
});

// Test utilities for component testing
export class ComponentTestUtils {
  static async renderWithUser(component: ReactElement, user: User = createMockUser()): Promise<RenderResult> {
    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn((key: string) => {
        if (key === 'users') {
          return JSON.stringify([user]);
        }
        return null;
      }),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    return render(component);
  }

  static async typeIntoInput(element: HTMLElement, text: string): Promise<void> {
    const user = userEvent.setup();
    await user.clear(element);
    await user.type(element, text);
  }

  static async clickButton(buttonText: string | RegExp): Promise<void> {
    const button = screen.getByRole('button', { name: buttonText });
    await userEvent.click(button);
  }

  static async selectOption(selectElement: HTMLElement, option: string): Promise<void> {
    const user = userEvent.setup();
    await user.selectOptions(selectElement, option);
  }

  static waitForLoadingToFinish(): Promise<void> {
    return waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  }

  static expectElementToBeVisible(text: string | RegExp): void {
    expect(screen.getByText(text)).toBeVisible();
  }

  static expectElementNotToBeInDocument(text: string | RegExp): void {
    expect(screen.queryByText(text)).not.toBeInTheDocument();
  }

  static async expectAsyncElementToAppear(text: string | RegExp, timeout = 5000): Promise<void> {
    await waitFor(() => {
      expect(screen.getByText(text)).toBeInTheDocument();
    }, { timeout });
  }
}

// Performance testing utilities
export class PerformanceTestUtils {
  static async measureRenderTime(renderFunction: () => void): Promise<number> {
    const startTime = performance.now();
    await renderFunction();
    const endTime = performance.now();
    return endTime - startTime;
  }

  static async measureAsyncOperation<T>(operation: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const startTime = performance.now();
    const result = await operation();
    const endTime = performance.now();
    return { result, duration: endTime - startTime };
  }

  static expectPerformanceWithinBudget(duration: number, budgetMs: number): void {
    expect(duration).toBeLessThan(budgetMs);
  }

  static createPerformanceObserverMock(): jest.MockedClass<typeof PerformanceObserver> {
    return jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn(() => []),
    })) as any;
  }
}

// API testing utilities
export class APITestUtils {
  static createMockRequest(url: string, options: RequestInit = {}): Request {
    return new Request(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  }

  static createMockResponse(data: any, status = 200): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static expectSuccessResponse(response: Response): void {
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
  }

  static expectErrorResponse(response: Response, expectedStatus: number): void {
    expect(response.status).toBe(expectedStatus);
  }

  static async expectJSONResponse(response: Response, expectedData: any): Promise<void> {
    const data = await response.json();
    expect(data).toEqual(expectedData);
  }
}

// Quiz specific test utilities
export class QuizTestUtils {
  static createMockQuizSession(problems: Problem[], config: QuizConfig = createMockQuizConfig()) {
    const answers: { [key: string]: string[] } = {};
    problems.forEach(problem => {
      answers[problem.id] = [];
    });

    return {
      problems,
      config,
      answers,
      currentQuestion: 0,
      timeLeft: config.timeLimit,
    };
  }

  static simulateQuizAnswers(problems: Problem[], correctPercentage = 0.5): { [key: string]: string[] } {
    const answers: { [key: string]: string[] } = {};
    
    problems.forEach((problem, index) => {
      const shouldBeCorrect = index < problems.length * correctPercentage;
      answers[problem.id] = shouldBeCorrect 
        ? [...problem.correctAlgorithms]
        : problem.algorithms.filter(alg => !problem.correctAlgorithms.includes(alg)).slice(0, 1);
    });

    return answers;
  }

  static calculateExpectedScore(problems: Problem[], answers: { [key: string]: string[] }): number {
    let correct = 0;
    
    problems.forEach(problem => {
      const userAnswer = answers[problem.id] || [];
      const isCorrect = userAnswer.length === problem.correctAlgorithms.length &&
        userAnswer.every(alg => problem.correctAlgorithms.includes(alg));
      
      if (isCorrect) correct++;
    });

    return Math.round((correct / problems.length) * 100);
  }
}

// Integration test helpers
export class IntegrationTestUtils {
  static setupEnvironment(): void {
    // Mock window.performance
    Object.defineProperty(window, 'performance', {
      value: {
        now: jest.fn(() => Date.now()),
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByName: jest.fn(() => []),
        getEntriesByType: jest.fn(() => []),
      },
      writable: true,
    });

    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  }

  static cleanupEnvironment(): void {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  }

  static async waitForNextTick(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
  }
}

// Accessibility testing utilities
export class AccessibilityTestUtils {
  static expectProperHeadingStructure(): void {
    const headings = screen.getAllByRole('heading');
    const levels = headings.map(heading => parseInt(heading.tagName.charAt(1)));
    
    // Check that headings follow proper hierarchy
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  }

  static expectProperFormLabeling(): void {
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveAccessibleName();
    });
  }

  static expectFocusableElements(): void {
    const focusableElements = screen.getAllByRole('button')
      .concat(screen.getAllByRole('link'))
      .concat(screen.getAllByRole('textbox'));
    
    focusableElements.forEach(element => {
      expect(element).toHaveAttribute('tabindex');
    });
  }

  static expectAriaLabels(expectedLabels: string[]): void {
    expectedLabels.forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  }
}

// Custom matchers for Jest
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinPerformanceBudget(budgetMs: number): R;
      toHaveValidAccessibility(): R;
    }
  }
}

// Export test suite helpers
export const testSuiteHelpers = {
  ComponentTestUtils,
  PerformanceTestUtils,
  APITestUtils,
  QuizTestUtils,
  IntegrationTestUtils,
  AccessibilityTestUtils,
};