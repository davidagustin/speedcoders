import { EventEmitter } from 'events';

interface PracticeSession {
  id: string;
  userId: string;
  mode: PracticeMode;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  startTime: Date;
  endTime?: Date;
  duration: number;
  problems: PracticeProblem[];
  currentProblemIndex: number;
  settings: PracticeSettings;
  stats: PracticeStats;
  history: PracticeEvent[];
}

interface PracticeMode {
  type: 'timed' | 'untimed' | 'survival' | 'marathon' | 'focus' | 'interview' | 'contest' | 'daily' | 'custom';
  name: string;
  description: string;
  rules: PracticeRules;
  scoring: ScoringSystem;
}

interface PracticeRules {
  timeLimit?: number; // in seconds
  problemCount?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  categories?: string[];
  allowHints?: boolean;
  allowSkip?: boolean;
  hintsDeductPoints?: boolean;
  skipDeductPoints?: boolean;
  failureCondition?: 'none' | 'time' | 'wrong_answers' | 'lives';
  lives?: number;
  streakBonus?: boolean;
  adaptiveDifficulty?: boolean;
}

interface ScoringSystem {
  baseScore: number;
  timeBonus: boolean;
  difficultyMultiplier: { Easy: number; Medium: number; Hard: number };
  streakMultiplier: number;
  hintPenalty: number;
  skipPenalty: number;
  perfectBonus: number;
}

interface PracticeSettings {
  showTimer: boolean;
  showProgress: boolean;
  showDifficulty: boolean;
  allowPause: boolean;
  autoNext: boolean;
  codeEditor: boolean;
  pseudocode: boolean;
  explanations: boolean;
  sounds: boolean;
  animations: boolean;
}

interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  algorithms: string[];
  timeEstimate: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  attempts: PracticeAttempt[];
  score: number;
  timeSpent: number;
  hintsUsed: number;
  correctAnswer?: any;
  userAnswer?: any;
}

interface PracticeAttempt {
  id: string;
  startTime: Date;
  endTime?: Date;
  answer: any;
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
  approach?: string;
  code?: string;
  explanation?: string;
}

interface PracticeStats {
  totalScore: number;
  problemsSolved: number;
  problemsAttempted: number;
  accuracy: number;
  averageTime: number;
  totalTime: number;
  hintsUsed: number;
  skipped: number;
  streak: number;
  maxStreak: number;
  difficultyBreakdown: { [key: string]: { attempted: number; solved: number } };
  categoryBreakdown: { [key: string]: { attempted: number; solved: number } };
  performance: PerformanceLevel;
}

interface PracticeEvent {
  id: string;
  timestamp: Date;
  type: 'start' | 'solve' | 'skip' | 'hint' | 'pause' | 'resume' | 'complete' | 'fail';
  problemId?: string;
  data?: any;
  scoreChange?: number;
}

type PerformanceLevel = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'expert' | 'master';

interface PracticeModeConfig {
  modes: PracticeMode[];
  defaultSettings: PracticeSettings;
  achievementThresholds: { [key: string]: number };
}

export class PracticeModeManager extends EventEmitter {
  private static instance: PracticeModeManager;
  private sessions: Map<string, PracticeSession> = new Map();
  private modes: Map<string, PracticeMode> = new Map();
  private config: PracticeModeConfig;

  private constructor() {
    super();
    this.config = this.getDefaultConfig();
    this.initializePracticeModes();
  }

  static getInstance(): PracticeModeManager {
    if (!PracticeModeManager.instance) {
      PracticeModeManager.instance = new PracticeModeManager();
    }
    return PracticeModeManager.instance;
  }

  // Create a new practice session
  async createPracticeSession(
    userId: string,
    modeType: string,
    customSettings?: Partial<PracticeSettings>
  ): Promise<PracticeSession> {
    const mode = this.modes.get(modeType);
    if (!mode) {
      throw new Error(`Practice mode "${modeType}" not found`);
    }

    const sessionId = this.generateSessionId();
    const problems = await this.selectProblems(mode);

    const session: PracticeSession = {
      id: sessionId,
      userId,
      mode,
      status: 'active',
      startTime: new Date(),
      duration: 0,
      problems,
      currentProblemIndex: 0,
      settings: { ...this.config.defaultSettings, ...customSettings },
      stats: this.initializeStats(),
      history: [{
        id: this.generateEventId(),
        timestamp: new Date(),
        type: 'start',
        data: { mode: modeType, problemCount: problems.length }
      }]
    };

    this.sessions.set(sessionId, session);
    this.emit('session:created', session);

    return session;
  }

  // Timed Challenge Mode
  async createTimedChallenge(
    userId: string,
    timeLimit: number,
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed' = 'Mixed'
  ): Promise<PracticeSession> {
    const timedMode: PracticeMode = {
      type: 'timed',
      name: `${timeLimit}-Minute Challenge`,
      description: `Solve as many problems as possible in ${timeLimit} minutes`,
      rules: {
        timeLimit: timeLimit * 60,
        difficulty,
        allowHints: true,
        hintsDeductPoints: true,
        streakBonus: true,
        adaptiveDifficulty: true
      },
      scoring: {
        baseScore: 100,
        timeBonus: true,
        difficultyMultiplier: { Easy: 1, Medium: 1.5, Hard: 2.5 },
        streakMultiplier: 1.2,
        hintPenalty: 10,
        skipPenalty: 0,
        perfectBonus: 50
      }
    };

    this.modes.set('timed-challenge', timedMode);
    return this.createPracticeSession(userId, 'timed-challenge');
  }

  // Survival Mode
  async createSurvivalMode(
    userId: string,
    lives: number = 3,
    startingDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy'
  ): Promise<PracticeSession> {
    const survivalMode: PracticeMode = {
      type: 'survival',
      name: 'Survival Mode',
      description: `Start with ${lives} lives. Wrong answers cost a life. Difficulty increases with progress.`,
      rules: {
        lives,
        difficulty: startingDifficulty,
        allowHints: true,
        allowSkip: false,
        hintsDeductPoints: true,
        failureCondition: 'lives',
        adaptiveDifficulty: true,
        streakBonus: true
      },
      scoring: {
        baseScore: 150,
        timeBonus: true,
        difficultyMultiplier: { Easy: 1, Medium: 2, Hard: 4 },
        streakMultiplier: 1.5,
        hintPenalty: 25,
        skipPenalty: 0,
        perfectBonus: 100
      }
    };

    this.modes.set('survival-mode', survivalMode);
    return this.createPracticeSession(userId, 'survival-mode');
  }

  // Focus Mode
  async createFocusMode(
    userId: string,
    category: string,
    problemCount: number = 10
  ): Promise<PracticeSession> {
    const focusMode: PracticeMode = {
      type: 'focus',
      name: `${category} Focus`,
      description: `Focus on mastering ${category} problems`,
      rules: {
        problemCount,
        categories: [category],
        difficulty: 'Mixed',
        allowHints: true,
        allowSkip: true,
        hintsDeductPoints: false,
        skipDeductPoints: false,
        adaptiveDifficulty: true
      },
      scoring: {
        baseScore: 100,
        timeBonus: false,
        difficultyMultiplier: { Easy: 1, Medium: 1.5, Hard: 2 },
        streakMultiplier: 1.1,
        hintPenalty: 0,
        skipPenalty: 5,
        perfectBonus: 25
      }
    };

    this.modes.set('focus-mode', focusMode);
    return this.createPracticeSession(userId, 'focus-mode');
  }

  // Interview Simulation Mode
  async createInterviewMode(
    userId: string,
    company: string = 'Generic',
    duration: number = 45
  ): Promise<PracticeSession> {
    const interviewMode: PracticeMode = {
      type: 'interview',
      name: `${company} Interview Simulation`,
      description: `Simulate a ${duration}-minute technical interview`,
      rules: {
        timeLimit: duration * 60,
        problemCount: 2,
        difficulty: 'Mixed',
        allowHints: true,
        allowSkip: false,
        hintsDeductPoints: true,
        adaptiveDifficulty: false
      },
      scoring: {
        baseScore: 200,
        timeBonus: true,
        difficultyMultiplier: { Easy: 1, Medium: 1.5, Hard: 2 },
        streakMultiplier: 1,
        hintPenalty: 20,
        skipPenalty: 0,
        perfectBonus: 100
      }
    };

    this.modes.set('interview-mode', interviewMode);
    return this.createPracticeSession(userId, 'interview-mode', {
      showTimer: true,
      codeEditor: true,
      explanations: true,
      allowPause: false
    });
  }

  // Daily Challenge Mode
  async createDailyChallenge(userId: string): Promise<PracticeSession> {
    const today = new Date().toDateString();
    const dailyMode: PracticeMode = {
      type: 'daily',
      name: 'Daily Challenge',
      description: 'Complete today\'s curated challenge',
      rules: {
        problemCount: 1,
        difficulty: this.getDailyDifficulty(),
        allowHints: true,
        allowSkip: false,
        hintsDeductPoints: true,
        streakBonus: true
      },
      scoring: {
        baseScore: 500,
        timeBonus: true,
        difficultyMultiplier: { Easy: 1, Medium: 2, Hard: 3 },
        streakMultiplier: 1.3,
        hintPenalty: 50,
        skipPenalty: 0,
        perfectBonus: 200
      }
    };

    this.modes.set(`daily-${today}`, dailyMode);
    return this.createPracticeSession(userId, `daily-${today}`);
  }

  // Marathon Mode
  async createMarathonMode(
    userId: string,
    targetProblems: number = 50
  ): Promise<PracticeSession> {
    const marathonMode: PracticeMode = {
      type: 'marathon',
      name: `${targetProblems}-Problem Marathon`,
      description: `Complete ${targetProblems} problems at your own pace`,
      rules: {
        problemCount: targetProblems,
        difficulty: 'Mixed',
        allowHints: true,
        allowSkip: true,
        hintsDeductPoints: false,
        skipDeductPoints: true,
        adaptiveDifficulty: true,
        streakBonus: true
      },
      scoring: {
        baseScore: 50,
        timeBonus: false,
        difficultyMultiplier: { Easy: 1, Medium: 1.5, Hard: 2 },
        streakMultiplier: 1.1,
        hintPenalty: 0,
        skipPenalty: 10,
        perfectBonus: 20
      }
    };

    this.modes.set('marathon-mode', marathonMode);
    return this.createPracticeSession(userId, 'marathon-mode', {
      allowPause: true,
      autoNext: false
    });
  }

  // Submit answer for current problem
  async submitAnswer(
    sessionId: string,
    answer: any,
    approach?: string,
    code?: string,
    explanation?: string
  ): Promise<{
    isCorrect: boolean;
    score: number;
    totalScore: number;
    feedback: string;
    nextProblem?: PracticeProblem;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'active') {
      throw new Error('Session not found or not active');
    }

    const currentProblem = session.problems[session.currentProblemIndex];
    if (!currentProblem) {
      throw new Error('No current problem');
    }

    const startTime = currentProblem.attempts.length > 0 
      ? currentProblem.attempts[currentProblem.attempts.length - 1].startTime
      : new Date();
    
    const timeSpent = Date.now() - startTime.getTime();
    const isCorrect = this.checkAnswer(currentProblem, answer);

    // Create attempt record
    const attempt: PracticeAttempt = {
      id: this.generateAttemptId(),
      startTime,
      endTime: new Date(),
      answer,
      isCorrect,
      timeSpent,
      hintsUsed: currentProblem.hintsUsed,
      approach,
      code,
      explanation
    };

    currentProblem.attempts.push(attempt);
    currentProblem.userAnswer = answer;
    currentProblem.timeSpent += timeSpent;

    // Calculate score for this attempt
    let score = 0;
    if (isCorrect) {
      score = this.calculateProblemScore(session, currentProblem, timeSpent);
      currentProblem.status = 'completed';
      currentProblem.score = score;
      
      // Update session stats
      session.stats.problemsSolved++;
      session.stats.totalScore += score;
      session.stats.streak++;
      session.stats.maxStreak = Math.max(session.stats.maxStreak, session.stats.streak);
      
      // Update difficulty breakdown
      const difficulty = currentProblem.difficulty;
      session.stats.difficultyBreakdown[difficulty].solved++;
      
      // Update category breakdown
      const category = currentProblem.category;
      if (!session.stats.categoryBreakdown[category]) {
        session.stats.categoryBreakdown[category] = { attempted: 0, solved: 0 };
      }
      session.stats.categoryBreakdown[category].solved++;
    } else {
      session.stats.streak = 0;
      
      // Check failure conditions
      if (session.mode.rules.failureCondition === 'lives' && session.mode.rules.lives) {
        session.mode.rules.lives--;
        if (session.mode.rules.lives <= 0) {
          session.status = 'completed';
          this.emit('session:failed', session);
        }
      }
    }

    // Update stats
    session.stats.problemsAttempted++;
    session.stats.totalTime += timeSpent;
    session.stats.accuracy = session.stats.problemsSolved / session.stats.problemsAttempted;
    session.stats.averageTime = session.stats.totalTime / session.stats.problemsAttempted;

    // Record event
    session.history.push({
      id: this.generateEventId(),
      timestamp: new Date(),
      type: isCorrect ? 'solve' : 'fail',
      problemId: currentProblem.id,
      data: { timeSpent, hintsUsed: currentProblem.hintsUsed, approach },
      scoreChange: score
    });

    // Generate feedback
    const feedback = this.generateFeedback(currentProblem, attempt, session);

    // Move to next problem or complete session
    let nextProblem: PracticeProblem | undefined;
    if (this.shouldContinueSession(session)) {
      session.currentProblemIndex++;
      nextProblem = session.problems[session.currentProblemIndex];
      
      // Adaptive difficulty adjustment
      if (session.mode.rules.adaptiveDifficulty) {
        await this.adjustDifficulty(session, isCorrect);
      }
    } else {
      session.status = 'completed';
      session.endTime = new Date();
      session.duration = session.endTime.getTime() - session.startTime.getTime();
      
      // Calculate performance level
      session.stats.performance = this.calculatePerformanceLevel(session.stats);
      
      this.emit('session:completed', session);
    }

    this.emit('answer:submitted', {
      sessionId,
      problemId: currentProblem.id,
      isCorrect,
      score,
      totalScore: session.stats.totalScore
    });

    return {
      isCorrect,
      score,
      totalScore: session.stats.totalScore,
      feedback,
      nextProblem
    };
  }

  // Skip current problem
  async skipProblem(sessionId: string, reason?: string): Promise<{
    skipped: boolean;
    penalty: number;
    nextProblem?: PracticeProblem;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'active') {
      throw new Error('Session not found or not active');
    }

    if (!session.mode.rules.allowSkip) {
      return { skipped: false, penalty: 0 };
    }

    const currentProblem = session.problems[session.currentProblemIndex];
    currentProblem.status = 'skipped';
    
    const penalty = session.mode.scoring.skipPenalty;
    session.stats.totalScore = Math.max(0, session.stats.totalScore - penalty);
    session.stats.skipped++;
    session.stats.streak = 0;

    // Record event
    session.history.push({
      id: this.generateEventId(),
      timestamp: new Date(),
      type: 'skip',
      problemId: currentProblem.id,
      data: { reason },
      scoreChange: -penalty
    });

    // Move to next problem
    let nextProblem: PracticeProblem | undefined;
    if (this.shouldContinueSession(session)) {
      session.currentProblemIndex++;
      nextProblem = session.problems[session.currentProblemIndex];
    } else {
      session.status = 'completed';
      session.endTime = new Date();
      session.duration = session.endTime.getTime() - session.startTime.getTime();
      session.stats.performance = this.calculatePerformanceLevel(session.stats);
      this.emit('session:completed', session);
    }

    this.emit('problem:skipped', {
      sessionId,
      problemId: currentProblem.id,
      penalty
    });

    return { skipped: true, penalty, nextProblem };
  }

  // Request hint
  async getHint(sessionId: string, hintLevel: number = 1): Promise<{
    hint: string;
    penalty: number;
    remainingHints: number;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'active') {
      throw new Error('Session not found or not active');
    }

    if (!session.mode.rules.allowHints) {
      throw new Error('Hints not allowed in this mode');
    }

    const currentProblem = session.problems[session.currentProblemIndex];
    const hints = this.getProblemHints(currentProblem);
    
    if (hintLevel > hints.length) {
      throw new Error('No more hints available');
    }

    const hint = hints[hintLevel - 1];
    const penalty = session.mode.rules.hintsDeductPoints ? session.mode.scoring.hintPenalty : 0;
    
    currentProblem.hintsUsed++;
    session.stats.hintsUsed++;
    
    if (penalty > 0) {
      session.stats.totalScore = Math.max(0, session.stats.totalScore - penalty);
    }

    // Record event
    session.history.push({
      id: this.generateEventId(),
      timestamp: new Date(),
      type: 'hint',
      problemId: currentProblem.id,
      data: { hintLevel, hint },
      scoreChange: -penalty
    });

    this.emit('hint:requested', {
      sessionId,
      problemId: currentProblem.id,
      hintLevel,
      penalty
    });

    return {
      hint,
      penalty,
      remainingHints: hints.length - hintLevel
    };
  }

  // Pause/Resume session
  async pauseSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'active') {
      return false;
    }

    if (!session.settings.allowPause) {
      return false;
    }

    session.status = 'paused';
    
    session.history.push({
      id: this.generateEventId(),
      timestamp: new Date(),
      type: 'pause'
    });

    this.emit('session:paused', session);
    return true;
  }

  async resumeSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'paused') {
      return false;
    }

    session.status = 'active';
    
    session.history.push({
      id: this.generateEventId(),
      timestamp: new Date(),
      type: 'resume'
    });

    this.emit('session:resumed', session);
    return true;
  }

  // Get session details
  getSession(sessionId: string): PracticeSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Get user's practice history
  async getUserPracticeHistory(userId: string): Promise<{
    sessions: PracticeSession[];
    totalStats: PracticeStats;
    achievements: string[];
    recommendations: string[];
  }> {
    const userSessions = Array.from(this.sessions.values())
      .filter(session => session.userId === userId);

    const totalStats = this.aggregateUserStats(userSessions);
    const achievements = this.calculateAchievements(totalStats);
    const recommendations = this.generateRecommendations(totalStats);

    return {
      sessions: userSessions,
      totalStats,
      achievements,
      recommendations
    };
  }

  // Private methods
  private async selectProblems(mode: PracticeMode): Promise<PracticeProblem[]> {
    // Mock implementation - would integrate with problem database
    const mockProblems: PracticeProblem[] = [];
    
    const count = mode.rules.problemCount || 10;
    for (let i = 0; i < count; i++) {
      mockProblems.push({
        id: `problem-${i + 1}`,
        title: `Problem ${i + 1}`,
        description: `Description for problem ${i + 1}`,
        difficulty: this.getRandomDifficulty(mode.rules.difficulty || 'Mixed'),
        category: mode.rules.categories?.[0] || 'Arrays',
        algorithms: ['Algorithm1', 'Algorithm2'],
        timeEstimate: 300 + Math.random() * 600,
        status: 'not_started',
        attempts: [],
        score: 0,
        timeSpent: 0,
        hintsUsed: 0,
        correctAnswer: `Solution ${i + 1}`
      });
    }

    return mockProblems;
  }

  private checkAnswer(problem: PracticeProblem, answer: any): boolean {
    // Mock implementation - would check against correct answer
    return Math.random() > 0.3; // 70% success rate for demo
  }

  private calculateProblemScore(
    session: PracticeSession,
    problem: PracticeProblem,
    timeSpent: number
  ): number {
    let score = session.mode.scoring.baseScore;

    // Difficulty multiplier
    score *= session.mode.scoring.difficultyMultiplier[problem.difficulty];

    // Time bonus
    if (session.mode.scoring.timeBonus && timeSpent < problem.timeEstimate) {
      const timeBonus = Math.max(0, (problem.timeEstimate - timeSpent) / problem.timeEstimate * 0.5);
      score *= (1 + timeBonus);
    }

    // Streak bonus
    if (session.mode.rules.streakBonus && session.stats.streak > 1) {
      score *= Math.pow(session.mode.scoring.streakMultiplier, session.stats.streak - 1);
    }

    // Hint penalty
    if (problem.hintsUsed > 0 && session.mode.rules.hintsDeductPoints) {
      score -= problem.hintsUsed * session.mode.scoring.hintPenalty;
    }

    // Perfect bonus (no hints, first attempt)
    if (problem.hintsUsed === 0 && problem.attempts.length === 1) {
      score += session.mode.scoring.perfectBonus;
    }

    return Math.max(0, Math.floor(score));
  }

  private generateFeedback(
    problem: PracticeProblem,
    attempt: PracticeAttempt,
    session: PracticeSession
  ): string {
    if (attempt.isCorrect) {
      const timeCategory = attempt.timeSpent < problem.timeEstimate ? 'quickly' : 'carefully';
      const hintUsage = attempt.hintsUsed === 0 ? 'without hints' : `with ${attempt.hintsUsed} hint(s)`;
      return `Great job! You solved this ${timeCategory} ${hintUsage}.`;
    } else {
      return 'Not quite right. Consider the problem constraints and try a different approach.';
    }
  }

  private shouldContinueSession(session: PracticeSession): boolean {
    // Check time limit
    if (session.mode.rules.timeLimit) {
      const elapsed = Date.now() - session.startTime.getTime();
      if (elapsed >= session.mode.rules.timeLimit * 1000) {
        return false;
      }
    }

    // Check problem count
    if (session.currentProblemIndex >= session.problems.length - 1) {
      return false;
    }

    // Check lives
    if (session.mode.rules.failureCondition === 'lives' && 
        session.mode.rules.lives !== undefined && 
        session.mode.rules.lives <= 0) {
      return false;
    }

    return true;
  }

  private async adjustDifficulty(session: PracticeSession, wasCorrect: boolean): Promise<void> {
    // Simple adaptive difficulty logic
    if (wasCorrect && session.stats.streak >= 3) {
      // Increase difficulty
      const nextProblem = session.problems[session.currentProblemIndex + 1];
      if (nextProblem && nextProblem.difficulty === 'Easy') {
        nextProblem.difficulty = 'Medium';
      } else if (nextProblem && nextProblem.difficulty === 'Medium') {
        nextProblem.difficulty = 'Hard';
      }
    } else if (!wasCorrect && session.stats.streak === 0) {
      // Decrease difficulty
      const nextProblem = session.problems[session.currentProblemIndex + 1];
      if (nextProblem && nextProblem.difficulty === 'Hard') {
        nextProblem.difficulty = 'Medium';
      } else if (nextProblem && nextProblem.difficulty === 'Medium') {
        nextProblem.difficulty = 'Easy';
      }
    }
  }

  private calculatePerformanceLevel(stats: PracticeStats): PerformanceLevel {
    const accuracy = stats.accuracy;
    const avgTime = stats.averageTime;
    const score = stats.totalScore;

    if (accuracy >= 0.9 && score >= 5000) return 'master';
    if (accuracy >= 0.85 && score >= 3000) return 'expert';
    if (accuracy >= 0.75 && score >= 2000) return 'advanced';
    if (accuracy >= 0.6 && score >= 1000) return 'intermediate';
    if (accuracy >= 0.4 && score >= 500) return 'novice';
    return 'beginner';
  }

  private aggregateUserStats(sessions: PracticeSession[]): PracticeStats {
    const aggregate: PracticeStats = this.initializeStats();
    
    sessions.forEach(session => {
      aggregate.totalScore += session.stats.totalScore;
      aggregate.problemsSolved += session.stats.problemsSolved;
      aggregate.problemsAttempted += session.stats.problemsAttempted;
      aggregate.totalTime += session.stats.totalTime;
      aggregate.hintsUsed += session.stats.hintsUsed;
      aggregate.skipped += session.stats.skipped;
      aggregate.maxStreak = Math.max(aggregate.maxStreak, session.stats.maxStreak);
      
      // Merge difficulty breakdown
      Object.keys(session.stats.difficultyBreakdown).forEach(difficulty => {
        if (!aggregate.difficultyBreakdown[difficulty]) {
          aggregate.difficultyBreakdown[difficulty] = { attempted: 0, solved: 0 };
        }
        aggregate.difficultyBreakdown[difficulty].attempted += 
          session.stats.difficultyBreakdown[difficulty].attempted;
        aggregate.difficultyBreakdown[difficulty].solved += 
          session.stats.difficultyBreakdown[difficulty].solved;
      });

      // Merge category breakdown
      Object.keys(session.stats.categoryBreakdown).forEach(category => {
        if (!aggregate.categoryBreakdown[category]) {
          aggregate.categoryBreakdown[category] = { attempted: 0, solved: 0 };
        }
        aggregate.categoryBreakdown[category].attempted += 
          session.stats.categoryBreakdown[category].attempted;
        aggregate.categoryBreakdown[category].solved += 
          session.stats.categoryBreakdown[category].solved;
      });
    });

    aggregate.accuracy = aggregate.problemsAttempted > 0 
      ? aggregate.problemsSolved / aggregate.problemsAttempted 
      : 0;
    aggregate.averageTime = aggregate.problemsAttempted > 0 
      ? aggregate.totalTime / aggregate.problemsAttempted 
      : 0;
    aggregate.performance = this.calculatePerformanceLevel(aggregate);

    return aggregate;
  }

  private calculateAchievements(stats: PracticeStats): string[] {
    const achievements: string[] = [];
    
    if (stats.maxStreak >= 10) achievements.push('Streak Master');
    if (stats.problemsSolved >= 100) achievements.push('Century Club');
    if (stats.accuracy >= 0.9) achievements.push('Precision Expert');
    if (stats.totalScore >= 10000) achievements.push('Score Champion');
    
    return achievements;
  }

  private generateRecommendations(stats: PracticeStats): string[] {
    const recommendations: string[] = [];
    
    if (stats.accuracy < 0.6) {
      recommendations.push('Focus on understanding problem patterns before optimizing for speed');
    }
    
    if (stats.averageTime > 600000) { // 10 minutes
      recommendations.push('Practice with time constraints to improve efficiency');
    }
    
    // Find weakest categories
    const weakCategories = Object.entries(stats.categoryBreakdown)
      .filter(([_, data]) => data.attempted > 0 && (data.solved / data.attempted) < 0.5)
      .map(([category, _]) => category);
    
    if (weakCategories.length > 0) {
      recommendations.push(`Consider focusing on: ${weakCategories.join(', ')}`);
    }

    return recommendations;
  }

  private initializeStats(): PracticeStats {
    return {
      totalScore: 0,
      problemsSolved: 0,
      problemsAttempted: 0,
      accuracy: 0,
      averageTime: 0,
      totalTime: 0,
      hintsUsed: 0,
      skipped: 0,
      streak: 0,
      maxStreak: 0,
      difficultyBreakdown: {
        Easy: { attempted: 0, solved: 0 },
        Medium: { attempted: 0, solved: 0 },
        Hard: { attempted: 0, solved: 0 }
      },
      categoryBreakdown: {},
      performance: 'beginner'
    };
  }

  private initializePracticeModes(): void {
    // Initialize built-in practice modes
    const basicModes = [
      {
        type: 'untimed' as const,
        name: 'Practice Mode',
        description: 'Solve problems at your own pace',
        rules: {
          difficulty: 'Mixed' as const,
          allowHints: true,
          allowSkip: true,
          hintsDeductPoints: false,
          skipDeductPoints: false
        },
        scoring: {
          baseScore: 100,
          timeBonus: false,
          difficultyMultiplier: { Easy: 1, Medium: 1.5, Hard: 2 },
          streakMultiplier: 1.1,
          hintPenalty: 0,
          skipPenalty: 0,
          perfectBonus: 25
        }
      }
    ];

    basicModes.forEach(mode => this.modes.set(mode.type, mode));
  }

  private getDailyDifficulty(): 'Easy' | 'Medium' | 'Hard' {
    const today = new Date().getDay();
    const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
    return difficulties[today % 3];
  }

  private getRandomDifficulty(baseDifficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed'): 'Easy' | 'Medium' | 'Hard' {
    if (baseDifficulty !== 'Mixed') return baseDifficulty;
    
    const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  }

  private getProblemHints(problem: PracticeProblem): string[] {
    // Mock implementation - would return actual hints
    return [
      'Consider the constraints of the problem',
      'Think about what data structure would be most efficient',
      'Break down the problem into smaller steps'
    ];
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private generateAttemptId(): string {
    return `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private getDefaultConfig(): PracticeModeConfig {
    return {
      modes: [],
      defaultSettings: {
        showTimer: true,
        showProgress: true,
        showDifficulty: true,
        allowPause: true,
        autoNext: false,
        codeEditor: false,
        pseudocode: true,
        explanations: true,
        sounds: true,
        animations: true
      },
      achievementThresholds: {
        streakMaster: 10,
        centuryClub: 100,
        precisionExpert: 0.9,
        scoreChampion: 10000
      }
    };
  }
}