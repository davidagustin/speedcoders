import { prisma } from '@/app/lib/prisma';
import { comprehensiveProblems } from './data/comprehensive-problems';
import { AICodeReviewer } from './AICodeReviewer';

export interface InterviewSession {
  id: string;
  candidateId: string;
  interviewerId?: string; // For live interviews with human interviewers
  type: 'technical' | 'system-design' | 'behavioral' | 'mixed';
  difficulty: 'junior' | 'mid-level' | 'senior' | 'staff';
  company: string; // Simulated company (Google, Meta, Amazon, etc.)
  duration: number; // in minutes
  problems: InterviewProblem[];
  currentProblemIndex: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  startTime: Date | null;
  endTime: Date | null;
  settings: InterviewSettings;
  feedback: InterviewFeedback | null;
  recording: InterviewRecording | null;
  score: InterviewScore | null;
  notes: string[];
  createdAt: Date;
}

export interface InterviewProblem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeLimit: number; // minutes
  hints: InterviewHint[];
  solution: {
    code: string;
    explanation: string;
    timeComplexity: string;
    spaceComplexity: string;
  };
  followUpQuestions: string[];
  candidateCode: string;
  candidateNotes: string;
  timeSpent: number;
  hintsUsed: number;
  completed: boolean;
  interviewerNotes: string;
}

export interface InterviewHint {
  id: string;
  content: string;
  type: 'approach' | 'optimization' | 'edge-case' | 'syntax';
  available: boolean;
  revealTime?: number; // Auto-reveal after X minutes
  penalty: number; // Score penalty for using hint
}

export interface InterviewSettings {
  allowHints: boolean;
  allowInternet: boolean;
  allowIDE: boolean;
  recordSession: boolean;
  realTimeEvaluation: boolean;
  interviewerPresent: boolean;
  companyStyle: 'google' | 'meta' | 'amazon' | 'microsoft' | 'netflix' | 'generic';
  language: string;
  enableVoiceChat: boolean;
  simulateNetworkIssues: boolean;
  stressMode: boolean; // Adds pressure with tighter time limits
}

export interface InterviewFeedback {
  overall: {
    rating: number; // 1-10
    recommendation: 'strong-hire' | 'hire' | 'no-hire' | 'strong-no-hire';
    summary: string;
  };
  technical: {
    problemSolving: number;
    codeQuality: number;
    algorithmKnowledge: number;
    optimization: number;
    debugging: number;
    testing: number;
  };
  behavioral: {
    communication: number;
    collaboration: number;
    leadership: number;
    adaptability: number;
    ownership: number;
  };
  areas: {
    strengths: string[];
    improvements: string[];
    redFlags: string[];
  };
  detailedNotes: string;
  recommendedNextSteps: string[];
}

export interface InterviewRecording {
  videoUrl?: string;
  audioUrl?: string;
  screenRecording?: string;
  codeHistory: CodeSnapshot[];
  chatLog: ChatMessage[];
  timestamps: InterviewTimestamp[];
}

export interface CodeSnapshot {
  timestamp: number;
  code: string;
  language: string;
  cursorPosition: number;
  activeFile: string;
}

export interface ChatMessage {
  timestamp: number;
  sender: 'candidate' | 'interviewer' | 'system';
  message: string;
  type: 'text' | 'code' | 'hint' | 'question';
}

export interface InterviewTimestamp {
  time: number;
  event: string;
  details: any;
}

export interface InterviewScore {
  overall: number; // 0-100
  breakdown: {
    correctness: number;
    efficiency: number;
    clarity: number;
    communication: number;
    problemSolving: number;
  };
  comparisonData: {
    percentile: number;
    averageForLevel: number;
    topPerformers: number;
  };
  timeBonus: number;
  hintPenalty: number;
  completionBonus: number;
}

export interface InterviewAnalytics {
  sessionId: string;
  candidateId: string;
  metrics: {
    codingTime: number;
    thinkingTime: number;
    totalTime: number;
    keystrokesPerMinute: number;
    linesOfCode: number;
    syntaxErrors: number;
    logicalErrors: number;
    testCasesPassed: number;
    optimizationIterations: number;
  };
  patterns: {
    problemApproach: string[];
    commonMistakes: string[];
    strongAreas: string[];
    timeDistribution: Record<string, number>;
  };
  predictions: {
    successProbability: number;
    recommendedRole: string;
    salaryRange: { min: number; max: number };
    improvementAreas: string[];
  };
}

export class InterviewSimulator {
  private static instance: InterviewSimulator;
  private codeReviewer: AICodeReviewer;
  private activeSessions = new Map<string, InterviewSession>();

  constructor() {
    this.codeReviewer = new AICodeReviewer();
  }

  static getInstance(): InterviewSimulator {
    if (!this.instance) {
      this.instance = new InterviewSimulator();
    }
    return this.instance;
  }

  async createInterviewSession(
    candidateId: string,
    type: InterviewSession['type'] = 'technical',
    difficulty: InterviewSession['difficulty'] = 'mid-level',
    company: string = 'Generic Tech Company',
    settings: Partial<InterviewSettings> = {}
  ): Promise<InterviewSession> {
    const sessionId = `interview_${candidateId}_${Date.now()}`;
    
    const defaultSettings: InterviewSettings = {
      allowHints: true,
      allowInternet: false,
      allowIDE: true,
      recordSession: true,
      realTimeEvaluation: true,
      interviewerPresent: false,
      companyStyle: 'generic',
      language: 'javascript',
      enableVoiceChat: false,
      simulateNetworkIssues: false,
      stressMode: false,
      ...settings
    };

    const problems = await this.selectInterviewProblems(type, difficulty, company, defaultSettings.companyStyle);
    const duration = this.calculateSessionDuration(problems, type);

    const session: InterviewSession = {
      id: sessionId,
      candidateId,
      type,
      difficulty,
      company,
      duration,
      problems,
      currentProblemIndex: 0,
      status: 'scheduled',
      startTime: null,
      endTime: null,
      settings: defaultSettings,
      feedback: null,
      recording: null,
      score: null,
      notes: [],
      createdAt: new Date()
    };

    this.activeSessions.set(sessionId, session);
    await this.persistSession(session);

    return session;
  }

  async startInterview(sessionId: string): Promise<InterviewSession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Interview session not found');
    }

    if (session.status !== 'scheduled') {
      throw new Error('Interview is not in scheduled state');
    }

    session.status = 'in-progress';
    session.startTime = new Date();
    
    // Initialize recording if enabled
    if (session.settings.recordSession) {
      session.recording = {
        codeHistory: [],
        chatLog: [{
          timestamp: 0,
          sender: 'system',
          message: this.generateWelcomeMessage(session),
          type: 'text'
        }],
        timestamps: [{
          time: 0,
          event: 'session_started',
          details: { sessionId, candidateId: session.candidateId }
        }]
      };
    }

    await this.persistSession(session);
    return session;
  }

  async submitProblemSolution(
    sessionId: string,
    problemIndex: number,
    code: string,
    notes: string = ''
  ): Promise<{ success: boolean; feedback?: any; score?: number }> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Interview session not found');
    }

    const problem = session.problems[problemIndex];
    if (!problem) {
      throw new Error('Problem not found');
    }

    problem.candidateCode = code;
    problem.candidateNotes = notes;
    problem.timeSpent = this.calculateTimeSpent(session.startTime!);
    problem.completed = true;

    // Get AI code review
    const review = await this.codeReviewer.reviewCode(
      problem.id,
      session.candidateId,
      code,
      session.settings.language
    );

    // Calculate problem score
    const problemScore = this.calculateProblemScore(problem, review);

    // Record code snapshot
    if (session.recording) {
      session.recording.codeHistory.push({
        timestamp: problem.timeSpent,
        code,
        language: session.settings.language,
        cursorPosition: code.length,
        activeFile: problem.title
      });

      session.recording.timestamps.push({
        time: problem.timeSpent,
        event: 'problem_submitted',
        details: { problemIndex, score: problemScore }
      });
    }

    await this.persistSession(session);

    return {
      success: true,
      feedback: review,
      score: problemScore
    };
  }

  async getHint(sessionId: string, problemIndex: number, hintIndex: number): Promise<InterviewHint> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Interview session not found');
    }

    if (!session.settings.allowHints) {
      throw new Error('Hints are not allowed in this interview');
    }

    const problem = session.problems[problemIndex];
    if (!problem) {
      throw new Error('Problem not found');
    }

    const hint = problem.hints[hintIndex];
    if (!hint) {
      throw new Error('Hint not found');
    }

    if (!hint.available) {
      throw new Error('Hint not yet available');
    }

    hint.available = false; // Mark as used
    problem.hintsUsed++;

    // Record hint usage
    if (session.recording) {
      session.recording.chatLog.push({
        timestamp: this.calculateTimeSpent(session.startTime!),
        sender: 'system',
        message: `Hint ${hintIndex + 1}: ${hint.content}`,
        type: 'hint'
      });
    }

    await this.persistSession(session);
    return hint;
  }

  async completeInterview(sessionId: string): Promise<InterviewSession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Interview session not found');
    }

    session.status = 'completed';
    session.endTime = new Date();

    // Generate comprehensive feedback
    session.feedback = await this.generateInterviewFeedback(session);
    session.score = await this.calculateOverallScore(session);

    // Generate analytics
    const analytics = await this.generateAnalytics(session);

    // Clean up active session
    this.activeSessions.delete(sessionId);

    await this.persistSession(session);
    await this.persistAnalytics(sessionId, analytics);

    return session;
  }

  async simulateInterviewer(sessionId: string, message: string): Promise<string> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Interview session not found');
    }

    // Simulate different interviewer personalities based on company
    const interviewerPersonality = this.getInterviewerPersonality(session.settings.companyStyle);
    const currentProblem = session.problems[session.currentProblemIndex];
    
    // Generate contextual response based on:
    // - Current problem state
    // - Candidate's progress
    // - Time remaining
    // - Company interview style

    const response = await this.generateInterviewerResponse(
      message,
      currentProblem,
      session,
      interviewerPersonality
    );

    // Record conversation
    if (session.recording) {
      session.recording.chatLog.push({
        timestamp: this.calculateTimeSpent(session.startTime!),
        sender: 'candidate',
        message,
        type: 'text'
      });

      session.recording.chatLog.push({
        timestamp: this.calculateTimeSpent(session.startTime!) + 1,
        sender: 'interviewer',
        message: response,
        type: 'text'
      });
    }

    await this.persistSession(session);
    return response;
  }

  private async selectInterviewProblems(
    type: InterviewSession['type'],
    difficulty: InterviewSession['difficulty'],
    company: string,
    companyStyle: InterviewSettings['companyStyle']
  ): Promise<InterviewProblem[]> {
    const problems: InterviewProblem[] = [];
    
    // Company-specific problem selection logic
    const companyPreferences = {
      google: ['Array', 'String', 'Dynamic Programming', 'Graph'],
      meta: ['Graph', 'Tree', 'Hash Table', 'Design'],
      amazon: ['Array', 'String', 'Tree', 'System Design'],
      microsoft: ['Dynamic Programming', 'Graph', 'Array', 'String'],
      netflix: ['System Design', 'Scalability', 'Microservices'],
      generic: ['Array', 'String', 'Dynamic Programming', 'Graph']
    };

    const preferredAlgorithms = companyPreferences[companyStyle] || companyPreferences.generic;
    
    // Difficulty mapping
    const difficultyMap = {
      junior: ['Easy'],
      'mid-level': ['Easy', 'Medium'],
      senior: ['Medium', 'Hard'],
      staff: ['Hard']
    };

    const allowedDifficulties = difficultyMap[difficulty];
    
    // Filter problems based on criteria
    const candidateProblems = comprehensiveProblems.filter(p => 
      allowedDifficulties.includes(p.difficulty) &&
      p.algorithms.some(algo => preferredAlgorithms.includes(algo))
    );

    // Select 2-3 problems for technical interviews
    const problemCount = type === 'system-design' ? 1 : (type === 'mixed' ? 3 : 2);
    const selectedProblems = this.shuffleArray(candidateProblems).slice(0, problemCount);

    selectedProblems.forEach((problem, index) => {
      const timeLimit = this.calculateProblemTimeLimit(problem, difficulty);
      
      problems.push({
        id: problem.id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        timeLimit,
        hints: this.generateInterviewHints(problem),
        solution: {
          code: problem.editorial?.solution || '',
          explanation: problem.editorial?.explanation || '',
          timeComplexity: problem.editorial?.timeComplexity || 'O(?)',
          spaceComplexity: problem.editorial?.spaceComplexity || 'O(?)'
        },
        followUpQuestions: this.generateFollowUpQuestions(problem, companyStyle),
        candidateCode: '',
        candidateNotes: '',
        timeSpent: 0,
        hintsUsed: 0,
        completed: false,
        interviewerNotes: ''
      });
    });

    return problems;
  }

  private generateInterviewHints(problem: any): InterviewHint[] {
    const hints: InterviewHint[] = [];
    
    // Generate progressive hints
    hints.push({
      id: `${problem.id}_hint_1`,
      content: `Think about what data structure would be most efficient for this problem.`,
      type: 'approach',
      available: true,
      penalty: 5
    });

    hints.push({
      id: `${problem.id}_hint_2`,
      content: `Consider the time complexity - can you optimize this to better than O(n²)?`,
      type: 'optimization',
      available: true,
      revealTime: 15, // Available after 15 minutes
      penalty: 10
    });

    hints.push({
      id: `${problem.id}_hint_3`,
      content: `Don't forget to handle edge cases like empty inputs or single elements.`,
      type: 'edge-case',
      available: true,
      revealTime: 25,
      penalty: 5
    });

    return hints;
  }

  private generateFollowUpQuestions(problem: any, companyStyle: InterviewSettings['companyStyle']): string[] {
    const questions: string[] = [];
    
    // Base questions
    questions.push('What is the time complexity of your solution?');
    questions.push('How would you optimize this further?');
    questions.push('What would happen if the input size was 1 billion elements?');
    
    // Company-specific questions
    if (companyStyle === 'google') {
      questions.push('How would you distribute this algorithm across multiple machines?');
    } else if (companyStyle === 'meta') {
      questions.push('How would you handle this at Facebook scale with billions of users?');
    } else if (companyStyle === 'amazon') {
      questions.push('How would you monitor and alert on this system in production?');
    }

    return questions;
  }

  private calculateProblemTimeLimit(problem: any, difficulty: InterviewSession['difficulty']): number {
    const baseTime = {
      'Easy': 20,
      'Medium': 30,
      'Hard': 45
    };

    const difficultyMultiplier = {
      'junior': 1.3,
      'mid-level': 1.0,
      'senior': 0.8,
      'staff': 0.7
    };

    const base = baseTime[problem.difficulty as keyof typeof baseTime] || 30;
    const multiplier = difficultyMultiplier[difficulty];
    
    return Math.round(base * multiplier);
  }

  private calculateSessionDuration(problems: InterviewProblem[], type: InterviewSession['type']): number {
    const problemTime = problems.reduce((sum, p) => sum + p.timeLimit, 0);
    const overhead = type === 'behavioral' ? 15 : 10; // Introduction and wrap-up time
    
    return problemTime + overhead;
  }

  private generateWelcomeMessage(session: InterviewSession): string {
    const companyGreeting = {
      google: "Welcome to your Google technical interview! I'm excited to work through some problems with you today.",
      meta: "Hi! Welcome to your Meta interview. We'll be diving into some interesting technical challenges.",
      amazon: "Welcome to your Amazon interview. We'll focus on problem-solving and coding best practices.",
      microsoft: "Welcome to Microsoft! Let's explore some algorithmic problems together.",
      generic: "Welcome to your technical interview! We'll work through some coding problems together."
    };

    const greeting = companyGreeting[session.settings.companyStyle] || companyGreeting.generic;
    
    return `${greeting}\n\nWe have ${session.duration} minutes total, with ${session.problems.length} problem${session.problems.length > 1 ? 's' : ''} to work through. Feel free to think out loud and ask questions as we go. Ready to begin?`;
  }

  private async generateInterviewerResponse(
    candidateMessage: string,
    currentProblem: InterviewProblem,
    session: InterviewSession,
    personality: any
  ): Promise<string> {
    // This would integrate with an AI service to generate realistic interviewer responses
    // For now, we'll use rule-based responses
    
    const lowerMessage = candidateMessage.toLowerCase();
    
    if (lowerMessage.includes('stuck') || lowerMessage.includes('help')) {
      return "That's okay! Let's think through this step by step. What's your initial approach to this problem?";
    }
    
    if (lowerMessage.includes('done') || lowerMessage.includes('finished')) {
      return "Great! Can you walk me through your solution? What's the time complexity?";
    }
    
    if (lowerMessage.includes('time complexity') || lowerMessage.includes('big o')) {
      return "Good thinking about complexity! How did you arrive at that analysis?";
    }
    
    // Default encouraging response
    const encouragingResponses = [
      "That's a good approach! Keep going.",
      "Interesting idea. Can you elaborate on that?",
      "I like your thinking. What's your next step?",
      "Good observation. How would you implement that?",
      "That makes sense. Are there any edge cases to consider?"
    ];
    
    return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
  }

  private getInterviewerPersonality(companyStyle: InterviewSettings['companyStyle']): any {
    const personalities = {
      google: { supportive: 0.8, challenging: 0.9, detail_oriented: 0.9 },
      meta: { supportive: 0.7, challenging: 0.8, detail_oriented: 0.7 },
      amazon: { supportive: 0.6, challenging: 0.9, detail_oriented: 0.8 },
      microsoft: { supportive: 0.8, challenging: 0.7, detail_oriented: 0.8 },
      generic: { supportive: 0.7, challenging: 0.7, detail_oriented: 0.7 }
    };

    return personalities[companyStyle] || personalities.generic;
  }

  private calculateTimeSpent(startTime: Date): number {
    return Math.round((Date.now() - startTime.getTime()) / 1000);
  }

  private calculateProblemScore(problem: InterviewProblem, review: any): number {
    let score = 0;

    // Base correctness score (40 points)
    if (review.overallFeedback.grade === 'A') score += 40;
    else if (review.overallFeedback.grade === 'B') score += 30;
    else if (review.overallFeedback.grade === 'C') score += 20;
    else if (review.overallFeedback.grade === 'D') score += 10;

    // Time efficiency (20 points)
    const timeRatio = problem.timeSpent / (problem.timeLimit * 60);
    if (timeRatio <= 0.5) score += 20;
    else if (timeRatio <= 0.7) score += 15;
    else if (timeRatio <= 1.0) score += 10;
    else score += 5;

    // Code quality (20 points)
    score += Math.min(20, (review.overallFeedback.score / 100) * 20);

    // Hint penalty
    score -= problem.hintsUsed * 5;

    // Optimization bonus (10 points)
    if (review.suggestions.length === 0) score += 10;
    else if (review.suggestions.length <= 2) score += 5;

    // Communication bonus (10 points) - based on notes quality
    if (problem.candidateNotes.length > 100) score += 10;
    else if (problem.candidateNotes.length > 50) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  private async calculateOverallScore(session: InterviewSession): Promise<InterviewScore> {
    const problemScores = session.problems.map(p => this.calculateProblemScore(p, {}));
    const overall = problemScores.reduce((sum, score) => sum + score, 0) / problemScores.length;

    return {
      overall: Math.round(overall),
      breakdown: {
        correctness: Math.round(overall * 0.4),
        efficiency: Math.round(overall * 0.2),
        clarity: Math.round(overall * 0.2),
        communication: Math.round(overall * 0.1),
        problemSolving: Math.round(overall * 0.1)
      },
      comparisonData: {
        percentile: await this.calculatePercentile(overall, session.difficulty),
        averageForLevel: await this.getAverageScoreForLevel(session.difficulty),
        topPerformers: await this.getTopPerformerScore(session.difficulty)
      },
      timeBonus: session.problems.reduce((sum, p) => sum + (p.timeLimit * 60 - p.timeSpent) * 0.1, 0),
      hintPenalty: session.problems.reduce((sum, p) => sum + p.hintsUsed * 5, 0),
      completionBonus: session.problems.filter(p => p.completed).length * 10
    };
  }

  private async generateInterviewFeedback(session: InterviewSession): Promise<InterviewFeedback> {
    const completedProblems = session.problems.filter(p => p.completed);
    const totalTime = this.calculateTimeSpent(session.startTime!);
    const averageScore = completedProblems.reduce((sum, p) => sum + this.calculateProblemScore(p, {}), 0) / completedProblems.length;

    let recommendation: InterviewFeedback['overall']['recommendation'] = 'no-hire';
    if (averageScore >= 80) recommendation = 'strong-hire';
    else if (averageScore >= 70) recommendation = 'hire';
    else if (averageScore >= 60) recommendation = 'no-hire';
    else recommendation = 'strong-no-hire';

    return {
      overall: {
        rating: Math.round(averageScore / 10),
        recommendation,
        summary: this.generateFeedbackSummary(session, averageScore, recommendation)
      },
      technical: {
        problemSolving: Math.min(10, Math.round(averageScore / 10)),
        codeQuality: Math.min(10, Math.round((averageScore * 0.8) / 10)),
        algorithmKnowledge: Math.min(10, Math.round((averageScore * 0.9) / 10)),
        optimization: Math.min(10, Math.round((averageScore * 0.7) / 10)),
        debugging: Math.min(10, Math.round((averageScore * 0.6) / 10)),
        testing: Math.min(10, Math.round((averageScore * 0.5) / 10))
      },
      behavioral: {
        communication: 8, // Based on notes and explanations
        collaboration: 7,
        leadership: 6,
        adaptability: 8,
        ownership: 7
      },
      areas: {
        strengths: this.identifyStrengths(session),
        improvements: this.identifyImprovements(session),
        redFlags: this.identifyRedFlags(session)
      },
      detailedNotes: this.generateDetailedNotes(session),
      recommendedNextSteps: this.generateNextSteps(session, recommendation)
    };
  }

  private generateFeedbackSummary(
    session: InterviewSession,
    averageScore: number,
    recommendation: InterviewFeedback['overall']['recommendation']
  ): string {
    const completedProblems = session.problems.filter(p => p.completed).length;
    const totalProblems = session.problems.length;
    
    if (recommendation === 'strong-hire') {
      return `Excellent performance! Solved ${completedProblems}/${totalProblems} problems with strong technical skills and clear communication.`;
    } else if (recommendation === 'hire') {
      return `Good performance with solid problem-solving abilities. Shows potential for growth in the role.`;
    } else if (recommendation === 'no-hire') {
      return `Mixed performance. Some technical skills demonstrated but needs improvement in key areas.`;
    } else {
      return `Performance below expectations. Significant gaps in fundamental concepts and problem-solving approach.`;
    }
  }

  private identifyStrengths(session: InterviewSession): string[] {
    const strengths: string[] = [];
    
    const completedProblems = session.problems.filter(p => p.completed);
    if (completedProblems.length === session.problems.length) {
      strengths.push('Completed all problems');
    }
    
    const lowHintUsage = session.problems.every(p => p.hintsUsed <= 1);
    if (lowHintUsage) {
      strengths.push('Independent problem solving');
    }
    
    const goodTimeManagement = session.problems.every(p => p.timeSpent <= p.timeLimit * 60);
    if (goodTimeManagement) {
      strengths.push('Excellent time management');
    }

    return strengths;
  }

  private identifyImprovements(session: InterviewSession): string[] {
    const improvements: string[] = [];
    
    const incompleteProblems = session.problems.filter(p => !p.completed);
    if (incompleteProblems.length > 0) {
      improvements.push('Time management and problem completion');
    }
    
    const highHintUsage = session.problems.some(p => p.hintsUsed > 2);
    if (highHintUsage) {
      improvements.push('Algorithm knowledge and pattern recognition');
    }

    return improvements;
  }

  private identifyRedFlags(session: InterviewSession): string[] {
    const redFlags: string[] = [];
    
    if (session.problems.filter(p => p.completed).length === 0) {
      redFlags.push('Unable to complete any problems');
    }
    
    return redFlags;
  }

  private generateDetailedNotes(session: InterviewSession): string {
    let notes = `Interview Duration: ${Math.round(this.calculateTimeSpent(session.startTime!) / 60)} minutes\n\n`;
    
    session.problems.forEach((problem, index) => {
      notes += `Problem ${index + 1}: ${problem.title}\n`;
      notes += `- Status: ${problem.completed ? 'Completed' : 'Incomplete'}\n`;
      notes += `- Time: ${Math.round(problem.timeSpent / 60)} minutes\n`;
      notes += `- Hints Used: ${problem.hintsUsed}\n`;
      if (problem.candidateNotes) {
        notes += `- Notes: ${problem.candidateNotes}\n`;
      }
      notes += '\n';
    });
    
    return notes;
  }

  private generateNextSteps(
    session: InterviewSession,
    recommendation: InterviewFeedback['overall']['recommendation']
  ): string[] {
    const nextSteps: string[] = [];
    
    if (recommendation === 'strong-hire' || recommendation === 'hire') {
      nextSteps.push('Proceed to next interview round');
      nextSteps.push('Consider for team matching');
    } else {
      nextSteps.push('Practice more algorithm problems');
      nextSteps.push('Focus on time management');
      nextSteps.push('Review fundamental data structures');
    }
    
    return nextSteps;
  }

  private async generateAnalytics(session: InterviewSession): Promise<InterviewAnalytics> {
    const totalTime = this.calculateTimeSpent(session.startTime!);
    const codingTime = session.problems.reduce((sum, p) => sum + p.timeSpent, 0);
    const thinkingTime = totalTime - codingTime;
    
    return {
      sessionId: session.id,
      candidateId: session.candidateId,
      metrics: {
        codingTime,
        thinkingTime,
        totalTime,
        keystrokesPerMinute: this.estimateKeystrokesPerMinute(session),
        linesOfCode: this.countTotalLinesOfCode(session),
        syntaxErrors: 0, // Would be tracked during coding
        logicalErrors: 0, // Would be tracked during testing
        testCasesPassed: 0, // Would be tracked during execution
        optimizationIterations: 0 // Would be tracked during coding
      },
      patterns: {
        problemApproach: ['brute-force', 'optimization'],
        commonMistakes: [],
        strongAreas: ['problem-solving'],
        timeDistribution: {
          'problem-solving': codingTime,
          'discussion': thinkingTime
        }
      },
      predictions: {
        successProbability: session.score?.overall || 0 / 100,
        recommendedRole: this.recommendRole(session),
        salaryRange: this.estimateSalaryRange(session),
        improvementAreas: session.feedback?.areas.improvements || []
      }
    };
  }

  private estimateKeystrokesPerMinute(session: InterviewSession): number {
    const totalChars = session.problems.reduce((sum, p) => sum + p.candidateCode.length, 0);
    const totalMinutes = this.calculateTimeSpent(session.startTime!) / 60;
    return Math.round(totalChars / Math.max(totalMinutes, 1));
  }

  private countTotalLinesOfCode(session: InterviewSession): number {
    return session.problems.reduce((sum, p) => sum + (p.candidateCode.split('\n').length - 1), 0);
  }

  private recommendRole(session: InterviewSession): string {
    const score = session.score?.overall || 0;
    
    if (score >= 90) return 'Senior Software Engineer';
    if (score >= 80) return 'Software Engineer II';
    if (score >= 70) return 'Software Engineer';
    if (score >= 60) return 'Junior Software Engineer';
    return 'Entry Level Position';
  }

  private estimateSalaryRange(session: InterviewSession): { min: number; max: number } {
    const role = this.recommendRole(session);
    
    const ranges: Record<string, { min: number; max: number }> = {
      'Senior Software Engineer': { min: 180000, max: 250000 },
      'Software Engineer II': { min: 140000, max: 180000 },
      'Software Engineer': { min: 120000, max: 160000 },
      'Junior Software Engineer': { min: 90000, max: 130000 },
      'Entry Level Position': { min: 70000, max: 100000 }
    };
    
    return ranges[role] || { min: 70000, max: 100000 };
  }

  private async calculatePercentile(score: number, difficulty: InterviewSession['difficulty']): Promise<number> {
    // This would query historical data - for now return estimated percentile
    const percentileMap = {
      90: 95,
      80: 85,
      70: 70,
      60: 50,
      50: 30
    };
    
    for (const [threshold, percentile] of Object.entries(percentileMap)) {
      if (score >= parseInt(threshold)) {
        return percentile;
      }
    }
    
    return 10;
  }

  private async getAverageScoreForLevel(difficulty: InterviewSession['difficulty']): Promise<number> {
    const averages = {
      junior: 65,
      'mid-level': 70,
      senior: 75,
      staff: 80
    };
    
    return averages[difficulty];
  }

  private async getTopPerformerScore(difficulty: InterviewSession['difficulty']): Promise<number> {
    const topScores = {
      junior: 85,
      'mid-level': 90,
      senior: 93,
      staff: 95
    };
    
    return topScores[difficulty];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private async persistSession(session: InterviewSession): Promise<void> {
    // Store in database - implement based on your schema
    console.log('Persisting interview session:', session.id);
  }

  private async persistAnalytics(sessionId: string, analytics: InterviewAnalytics): Promise<void> {
    // Store analytics in database - implement based on your schema
    console.log('Persisting interview analytics:', sessionId);
  }
}

export const interviewSimulator = InterviewSimulator.getInstance();