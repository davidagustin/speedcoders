# Security Fixes Implementation Plan

## Critical Security Vulnerabilities - Immediate Action Required

### 🔴 PRIORITY 1: Code Execution Vulnerability

#### Current Issue
```typescript
// DANGEROUS CODE in app/lib/code-execution.ts
private async executeWithTimeout(code: string, input: any, timeout: number): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const func = new Function('return ' + code)(); // CRITICAL VULNERABILITY
      const result = func(input);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
```

#### Impact
- Remote Code Execution (RCE)
- Complete system compromise
- Data theft potential
- Server takeover possible

#### Immediate Fix Required
Replace dangerous execution with secure alternatives:

```typescript
// SECURE ALTERNATIVE 1: Server-side sandboxing
private async executeWithTimeout(code: string, input: any, timeout: number): Promise<any> {
  // Send to secure execution service
  const response = await fetch('/api/execute-secure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, input, timeout, language: 'javascript' })
  });
  
  if (!response.ok) {
    throw new Error('Execution failed');
  }
  
  return await response.json();
}

// SECURE ALTERNATIVE 2: Disable client-side execution entirely
private async executeWithTimeout(code: string, input: any, timeout: number): Promise<any> {
  throw new Error('Code execution disabled for security. Use server-side execution.');
}
```

### 🔴 PRIORITY 2: Authentication System Implementation

#### Files Requiring Authentication
- `app/api/quiz/create/route.ts`
- `app/api/problems/route.ts`
- `app/api/analytics/route.ts`
- `app/api/progress/route.ts`
- All other API routes

#### Current Issue
```typescript
// NO AUTHENTICATION CHECK
export async function POST(request: NextRequest) {
  const data = await request.json();
  // Direct database access without user verification
}
```

#### Security Fix Implementation
```typescript
// ADD AUTHENTICATION MIDDLEWARE
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth/next-auth';

export async function POST(request: NextRequest) {
  // SECURITY: Verify user authentication
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 401 }
    );
  }
  
  // SECURITY: Validate user permissions
  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json(
      { error: 'Invalid user session' },
      { status: 403 }
    );
  }
  
  try {
    const data = await request.json();
    // Process with authenticated user context
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 🔴 PRIORITY 3: Input Validation & Sanitization

#### Current Issue
```typescript
// NO INPUT VALIDATION
const { code, language, problemId } = await request.json();
// Direct usage without sanitization
```

#### Security Implementation
```typescript
import { z } from 'zod';

// SECURITY: Define validation schemas
const CodeSubmissionSchema = z.object({
  code: z.string()
    .min(1, 'Code cannot be empty')
    .max(10000, 'Code too long')
    .refine(code => !code.includes('eval'), 'Dangerous code detected')
    .refine(code => !code.includes('Function'), 'Dangerous code detected'),
  language: z.enum(['javascript', 'python', 'java', 'cpp']),
  problemId: z.string().uuid('Invalid problem ID'),
  testCases: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string()
  })).optional()
});

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json();
    
    // SECURITY: Validate input data
    const validatedData = CodeSubmissionSchema.parse(rawData);
    
    // SECURITY: Additional sanitization
    const sanitizedCode = sanitizeCode(validatedData.code);
    
    // Process with validated data
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function sanitizeCode(code: string): string {
  return code
    .replace(/eval\s*\(/g, '/* eval */')
    .replace(/Function\s*\(/g, '/* Function */')
    .replace(/new\s+Function/g, '/* new Function */')
    .replace(/import\s/g, '/* import */')
    .replace(/require\s*\(/g, '/* require */');
}
```

## Implementation Timeline

### Week 1: Critical Security Patches
- [ ] Remove code execution vulnerability
- [ ] Add authentication to all API endpoints
- [ ] Implement input validation schemas
- [ ] Add rate limiting to prevent DoS

### Week 2: Security Hardening
- [ ] Add CSRF protection
- [ ] Implement proper session management
- [ ] Add SQL injection protection
- [ ] Secure file upload handling

### Week 3: Monitoring & Logging
- [ ] Add security event logging
- [ ] Implement intrusion detection
- [ ] Add audit trails
- [ ] Monitor failed authentication attempts

## Required Dependencies

```json
{
  "dependencies": {
    "zod": "^3.22.4",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
```

## Security Configuration

### Environment Variables Required
```bash
# .env.local
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-key"
DATABASE_URL="your-secure-database-url"
ENCRYPTION_KEY="your-encryption-key"
```

### Security Headers
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  return response;
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*']
};
```

## Testing Security Fixes

### Security Test Suite
```typescript
// tests/security.test.ts
describe('Security Tests', () => {
  test('should reject unauthenticated requests', async () => {
    const response = await fetch('/api/quiz/create', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Quiz' })
    });
    expect(response.status).toBe(401);
  });

  test('should sanitize malicious code input', async () => {
    const maliciousCode = 'eval("malicious code")';
    const sanitized = sanitizeCode(maliciousCode);
    expect(sanitized).not.toContain('eval');
  });

  test('should validate input schemas', async () => {
    const invalidData = { code: '', language: 'invalid' };
    expect(() => CodeSubmissionSchema.parse(invalidData)).toThrow();
  });
});
```

## Deployment Security Checklist

### Pre-Production Security Audit
- [ ] All code execution removed from client-side
- [ ] Authentication implemented on all endpoints
- [ ] Input validation in place
- [ ] SQL injection protection verified
- [ ] XSS protection implemented
- [ ] CSRF tokens configured
- [ ] Rate limiting active
- [ ] Security headers configured
- [ ] Sensitive data encrypted
- [ ] Error messages don't leak information

### Production Security Monitoring
- [ ] Security scanning automated
- [ ] Vulnerability monitoring active
- [ ] Intrusion detection configured
- [ ] Audit logging enabled
- [ ] Incident response plan ready

## Post-Implementation Verification

### Security Testing Commands
```bash
# Run security tests
npm run test:security

# Check for vulnerabilities
npm audit

# Run static security analysis
npm run lint:security

# Check for hardcoded secrets
npm run check:secrets
```

This security implementation plan addresses all critical vulnerabilities found in the code review and provides a roadmap for securing the application before production deployment.