import { NextRequest, NextResponse } from 'next/server';
import { 
  rateLimiters, 
  applyRateLimit, 
  applySecurityHeaders, 
  validateRequest,
  InputSanitizer,
  CSRFProtection 
} from '@/lib/security/SecurityUtils';
import { PerformanceMonitor } from '@/lib/PerformanceMonitor';

export async function POST(request: NextRequest) {
  const performanceMonitor = PerformanceMonitor.getInstance();
  performanceMonitor.markStart('secure-quiz-api');

  try {
    // Apply rate limiting
    const rateLimitResponse = await applyRateLimit(request, rateLimiters.quiz);
    if (rateLimitResponse) {
      return applySecurityHeaders(rateLimitResponse);
    }

    // Validate request structure
    const validation = validateRequest(request, {
      requireCSRF: true,
      validateJSON: true,
      sanitizeBody: true,
    });

    if (!validation.isValid) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: 'Invalid request', details: validation.errors },
          { status: 400 }
        )
      );
    }

    // Parse and sanitize body
    let body;
    try {
      const rawBody = await request.text();
      body = JSON.parse(rawBody);
      body = InputSanitizer.sanitizeObject(body);
    } catch (error) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: 'Invalid JSON body' },
          { status: 400 }
        )
      );
    }

    // Validate quiz data structure
    const quizValidation = InputSanitizer.validateQuizData(body);
    if (!quizValidation.isValid) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: 'Invalid quiz data', details: quizValidation.errors },
          { status: 400 }
        )
      );
    }

    // Process the quiz submission securely
    const result = await processSecureQuizSubmission(body);

    performanceMonitor.markEnd('secure-quiz-api');

    return applySecurityHeaders(
      NextResponse.json(result, { status: 200 })
    );

  } catch (error) {
    console.error('Secure quiz API error:', error);
    performanceMonitor.markEnd('secure-quiz-api');

    return applySecurityHeaders(
      NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting for GET requests
    const rateLimitResponse = await applyRateLimit(request, rateLimiters.general);
    if (rateLimitResponse) {
      return applySecurityHeaders(rateLimitResponse);
    }

    // Get quiz data with security measures
    const quizData = await getSecureQuizData(request);

    return applySecurityHeaders(
      NextResponse.json(quizData, { status: 200 })
    );

  } catch (error) {
    console.error('Secure quiz GET API error:', error);

    return applySecurityHeaders(
      NextResponse.json(
        { error: 'Failed to retrieve quiz data' },
        { status: 500 }
      )
    );
  }
}

// Helper functions
async function processSecureQuizSubmission(data: any): Promise<any> {
  // Validate user authentication
  if (!data.userId) {
    throw new Error('User authentication required');
  }

  // Validate quiz answers
  if (!data.answers || !Array.isArray(data.answers)) {
    throw new Error('Invalid answers format');
  }

  // Validate time limits
  if (data.timeSpent > data.timeLimit + 60) { // Allow 1 minute grace period
    throw new Error('Time limit exceeded');
  }

  // Process the quiz results
  const processedResult = {
    id: generateSecureId(),
    userId: InputSanitizer.sanitizeHTML(data.userId),
    score: calculateSecureScore(data.answers),
    timeSpent: Math.min(data.timeSpent, data.timeLimit + 60),
    submittedAt: new Date().toISOString(),
    verified: true,
  };

  // Store result securely
  await storeQuizResult(processedResult);

  return {
    success: true,
    result: processedResult,
    nextRecommendations: await getSecureRecommendations(data.userId),
  };
}

async function getSecureQuizData(request: NextRequest): Promise<any> {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const mode = url.searchParams.get('mode') || 'default';

  if (!userId) {
    throw new Error('User ID required');
  }

  // Sanitize parameters
  const sanitizedUserId = InputSanitizer.sanitizeHTML(userId);
  const sanitizedMode = InputSanitizer.sanitizeHTML(mode);

  // Validate mode
  const validModes = ['smart', 'company', 'algorithm', 'difficulty', 'speed', 'challenge'];
  if (!validModes.includes(sanitizedMode)) {
    throw new Error('Invalid quiz mode');
  }

  // Get user-specific quiz data
  const quizData = await generateSecureQuizData(sanitizedUserId, sanitizedMode);

  return {
    questions: quizData.questions,
    config: quizData.config,
    csrfToken: CSRFProtection.generateToken(),
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    },
  };
}

function calculateSecureScore(answers: any[]): number {
  let correct = 0;
  let total = answers.length;

  for (const answer of answers) {
    // Validate answer structure
    if (!answer.questionId || !answer.selectedAlgorithms || !answer.correctAlgorithms) {
      continue;
    }

    // Check if answer is correct
    const selected = Array.isArray(answer.selectedAlgorithms) ? answer.selectedAlgorithms : [];
    const correct_algorithms = Array.isArray(answer.correctAlgorithms) ? answer.correctAlgorithms : [];

    const isCorrect = selected.length === correct_algorithms.length &&
      selected.every((alg: string) => correct_algorithms.includes(alg));

    if (isCorrect) {
      correct++;
    }
  }

  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

function generateSecureId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `quiz_${timestamp}_${randomPart}`;
}

async function storeQuizResult(result: any): Promise<void> {
  // In a real implementation, this would store to a secure database
  console.log('Storing quiz result securely:', result.id);
  
  // Simulate database storage
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
}

async function generateSecureQuizData(userId: string, mode: string): Promise<any> {
  // Generate quiz data based on user and mode
  // This would typically involve database queries
  
  return {
    questions: [
      // Mock questions - in real implementation, fetch from database
      {
        id: 'q1',
        title: 'Two Sum',
        difficulty: 'Easy',
        algorithms: ['Hash Table', 'Array', 'Two Pointers'],
        correctAlgorithms: ['Hash Table', 'Array'],
      },
    ],
    config: {
      mode,
      timeLimit: 600,
      questionCount: 10,
      difficulty: 'Mixed',
    },
  };
}

async function getSecureRecommendations(userId: string): Promise<string[]> {
  // Generate secure recommendations for the user
  return [
    'Focus on Hash Table algorithms',
    'Practice more Easy problems',
    'Review Two Pointers technique',
  ];
}