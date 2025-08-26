import { NextRequest } from 'next/server';
import { headers } from 'next/headers';

// Rate limiting implementation
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      message: 'Too many requests, please try again later.',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config,
    };
  }

  private getKey(request: NextRequest): string {
    // Use IP address as the primary identifier
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
    
    // Add user agent for additional uniqueness
    const userAgent = request.headers.get('user-agent') || '';
    const userAgentHash = this.simpleHash(userAgent);
    
    return `${ip}:${userAgentHash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private cleanupExpired(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime <= now) {
        delete this.store[key];
      }
    });
  }

  checkLimit(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
    this.cleanupExpired();
    
    const key = this.getKey(request);
    const now = Date.now();
    
    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: this.store[key].resetTime,
      };
    }

    const record = this.store[key];
    
    if (now >= record.resetTime) {
      record.count = 1;
      record.resetTime = now + this.config.windowMs;
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: record.resetTime,
      };
    }

    record.count++;
    
    return {
      allowed: record.count <= this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - record.count),
      resetTime: record.resetTime,
    };
  }

  increment(request: NextRequest): void {
    const key = this.getKey(request);
    if (this.store[key]) {
      this.store[key].count++;
    }
  }
}

// CSRF Protection
export class CSRFProtection {
  private static readonly CSRF_TOKEN_LENGTH = 32;
  private static readonly CSRF_HEADER_NAME = 'x-csrf-token';
  private static readonly CSRF_COOKIE_NAME = 'csrf-token';

  static generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < this.CSRF_TOKEN_LENGTH; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static validateToken(request: NextRequest): boolean {
    const headerToken = request.headers.get(this.CSRF_HEADER_NAME);
    const cookieToken = request.cookies.get(this.CSRF_COOKIE_NAME)?.value;

    return !!(headerToken && cookieToken && headerToken === cookieToken);
  }

  static getTokenFromHeaders(): string | null {
    const headersList = headers();
    return headersList.get(this.CSRF_HEADER_NAME);
  }
}

// Input Sanitization
export class InputSanitizer {
  private static readonly HTML_REGEX = /<[^>]*>/g;
  private static readonly SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  private static readonly SQL_INJECTION_REGEX = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)|('|\\\\')|(;)|(--)|(\|)|(\*)/gi;

  static sanitizeHTML(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(this.SCRIPT_REGEX, '')
      .replace(this.HTML_REGEX, '')
      .trim();
  }

  static sanitizeForSQL(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/'/g, "''") // Escape single quotes
      .replace(/\\/g, '\\\\') // Escape backslashes
      .replace(/\x00/g, '') // Remove null bytes
      .trim();
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return typeof obj === 'string' ? this.sanitizeHTML(obj) : obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = this.sanitizeHTML(key);
      sanitized[sanitizedKey] = this.sanitizeObject(value);
    }

    return sanitized;
  }

  static validateQuizData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('Invalid data format');
      return { isValid: false, errors };
    }

    // Validate mode
    const validModes = ['smart', 'company', 'algorithm', 'difficulty', 'speed', 'challenge', 'custom'];
    if (!validModes.includes(data.mode)) {
      errors.push('Invalid quiz mode');
    }

    // Validate difficulty
    const validDifficulties = ['Easy', 'Medium', 'Hard', 'Mixed'];
    if (!validDifficulties.includes(data.difficulty)) {
      errors.push('Invalid difficulty level');
    }

    // Validate time limit (between 1 minute and 2 hours)
    if (typeof data.timeLimit !== 'number' || data.timeLimit < 60 || data.timeLimit > 7200) {
      errors.push('Invalid time limit');
    }

    // Validate question count (between 1 and 50)
    if (typeof data.questionCount !== 'number' || data.questionCount < 1 || data.questionCount > 50) {
      errors.push('Invalid question count');
    }

    return { isValid: errors.length === 0, errors };
  }
}

// Security Headers
export const SecurityHeaders = {
  // Content Security Policy
  CSP: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.vercel.com;",
  
  // Other security headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
};

// Pre-configured rate limiters
export const rateLimiters = {
  // General API endpoints - 100 requests per 15 minutes
  general: new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
  }),
  
  // Quiz endpoints - 30 requests per 10 minutes
  quiz: new RateLimiter({
    windowMs: 10 * 60 * 1000,
    maxRequests: 30,
  }),
  
  // Auth endpoints - 10 requests per 15 minutes
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 10,
  }),
  
  // Admin endpoints - 50 requests per 15 minutes
  admin: new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 50,
  }),
  
  // Performance reporting - 20 requests per 5 minutes
  performance: new RateLimiter({
    windowMs: 5 * 60 * 1000,
    maxRequests: 20,
  }),
};

// Middleware helper functions
export const applyRateLimit = async (request: NextRequest, limiter: RateLimiter) => {
  const result = limiter.checkLimit(request);
  
  if (!result.allowed) {
    return new Response(
      JSON.stringify({ 
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
      }),
      { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': limiter['config'].maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
        }
      }
    );
  }

  return null; // Continue to next middleware/handler
};

export const applySecurityHeaders = (response: Response) => {
  // Apply CSP
  response.headers.set('Content-Security-Policy', SecurityHeaders.CSP);
  
  // Apply other security headers
  Object.entries(SecurityHeaders.headers).forEach(([name, value]) => {
    response.headers.set(name, value);
  });
  
  return response;
};

// Request validation
export const validateRequest = (request: NextRequest, options: {
  requireCSRF?: boolean;
  sanitizeBody?: boolean;
  validateJSON?: boolean;
} = {}) => {
  const errors: string[] = [];

  // CSRF validation for state-changing requests
  if (options.requireCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    if (!CSRFProtection.validateToken(request)) {
      errors.push('Invalid CSRF token');
    }
  }

  // Content-Type validation for JSON requests
  if (options.validateJSON && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      errors.push('Invalid Content-Type. Expected application/json');
    }
  }

  return { isValid: errors.length === 0, errors };
};