# SpeedCoders API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Quiz Management](#quiz-management)
3. [Problem Management](#problem-management)
4. [Analytics](#analytics)
5. [Learning Paths](#learning-paths)
6. [Interview Simulator](#interview-simulator)
7. [Collaboration](#collaboration)
8. [Performance Monitoring](#performance-monitoring)

---

## Authentication

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "token": "string"
}
```

### POST /api/auth/login
Authenticate user and receive session token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "token": "string"
}
```

---

## Quiz Management

### POST /api/quiz/create
Create a new quiz with selected problems.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "difficulty": "Easy | Medium | Hard | Mixed",
  "category": "string",
  "problemIds": ["string"],
  "timeLimit": "number (minutes)",
  "settings": {
    "shuffleQuestions": "boolean",
    "showHints": "boolean",
    "allowSkip": "boolean"
  }
}
```

**Response:**
```json
{
  "success": true,
  "quiz": {
    "id": "string",
    "title": "string",
    "description": "string",
    "difficulty": "string",
    "category": "string",
    "problemCount": "number",
    "timeLimit": "number",
    "createdAt": "ISO 8601 date"
  }
}
```

### GET /api/quiz/:id
Get quiz details by ID.

**Response:**
```json
{
  "success": true,
  "quiz": {
    "id": "string",
    "title": "string",
    "description": "string",
    "problems": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "difficulty": "string",
        "category": "string",
        "hints": ["string"],
        "algorithms": ["string"]
      }
    ],
    "timeLimit": "number",
    "settings": {}
  }
}
```

### POST /api/quiz/:id/submit
Submit quiz answers and get results.

**Request Body:**
```json
{
  "answers": {
    "problemId": {
      "selectedAlgorithms": ["string"],
      "code": "string",
      "timeSpent": "number"
    }
  },
  "totalTimeSpent": "number"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "id": "string",
    "score": "number",
    "correctAnswers": "number",
    "totalQuestions": "number",
    "accuracy": "number",
    "timeSpent": "number",
    "problemResults": [
      {
        "problemId": "string",
        "isCorrect": "boolean",
        "accuracy": "number",
        "feedback": "string"
      }
    ]
  }
}
```

---

## Problem Management

### GET /api/problems
Get paginated list of problems with filters.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `difficulty`: Easy | Medium | Hard
- `category`: string
- `algorithms`: comma-separated string
- `search`: string

**Response:**
```json
{
  "success": true,
  "problems": [
    {
      "id": "string",
      "title": "string",
      "difficulty": "string",
      "category": "string",
      "algorithms": ["string"],
      "acceptanceRate": "number",
      "frequency": "number",
      "companies": ["string"]
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

### GET /api/problems/:id
Get detailed problem information.

**Response:**
```json
{
  "success": true,
  "problem": {
    "id": "string",
    "title": "string",
    "description": "string",
    "difficulty": "string",
    "category": "string",
    "algorithms": ["string"],
    "hints": ["string"],
    "examples": [
      {
        "input": "string",
        "output": "string",
        "explanation": "string"
      }
    ],
    "constraints": ["string"],
    "editorial": {
      "approach": "string",
      "solution": "string",
      "timeComplexity": "string",
      "spaceComplexity": "string"
    },
    "similarProblems": ["string"],
    "companies": ["string"],
    "frequency": "number"
  }
}
```

---

## Analytics

### GET /api/analytics
Get user analytics and performance metrics.

**Query Parameters:**
- `timeframe`: 7d | 30d | 90d | 1y | all
- `userId`: string (optional, defaults to current user)

**Response:**
```json
{
  "success": true,
  "analytics": {
    "overview": {
      "totalProblems": "number",
      "solvedProblems": "number",
      "accuracy": "number",
      "averageTime": "number",
      "streak": "number",
      "rank": "number"
    },
    "categoryBreakdown": [
      {
        "category": "string",
        "solved": "number",
        "total": "number",
        "accuracy": "number"
      }
    ],
    "difficultyBreakdown": [
      {
        "difficulty": "string",
        "solved": "number",
        "total": "number",
        "accuracy": "number"
      }
    ],
    "recentActivity": [
      {
        "date": "ISO 8601 date",
        "problemsSolved": "number",
        "timeSpent": "number",
        "accuracy": "number"
      }
    ],
    "algorithmMastery": [
      {
        "algorithm": "string",
        "mastery": "number",
        "problemsSolved": "number",
        "lastUsed": "ISO 8601 date"
      }
    ]
  }
}
```

### GET /api/analytics/advanced
Get advanced analytics with AI insights.

**Response:**
```json
{
  "success": true,
  "analytics": {
    "performanceTrends": {
      "improving": ["string"],
      "declining": ["string"],
      "stable": ["string"]
    },
    "predictedRank": "number",
    "estimatedTimeToNextLevel": "number",
    "recommendations": [
      {
        "type": "problem | topic | difficulty | pacing",
        "recommendation": "string",
        "confidence": "number",
        "expectedImprovement": "number"
      }
    ],
    "competitiveAnalysis": {
      "percentile": "number",
      "strongerThan": "number",
      "averageForLevel": "object"
    }
  }
}
```

---

## Learning Paths

### GET /api/learning/profile
Get user's learning profile.

**Response:**
```json
{
  "success": true,
  "profile": {
    "userId": "string",
    "strengths": ["string"],
    "weaknesses": ["string"],
    "preferredDifficulty": "string",
    "learningVelocity": "number",
    "consistencyScore": "number",
    "algorithmMastery": {},
    "averageAccuracy": "number",
    "totalProblemsAttempted": "number",
    "learningGoals": ["string"]
  }
}
```

### POST /api/learning/profile
Create personalized learning path.

**Request Body:**
```json
{
  "goals": ["string"],
  "timeCommitment": "number (hours/week)",
  "targetDate": "ISO 8601 date",
  "focusAreas": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "learningPath": {
    "id": "string",
    "title": "string",
    "description": "string",
    "estimatedDuration": "number (days)",
    "difficulty": "string",
    "problems": [
      {
        "problemId": "string",
        "title": "string",
        "difficulty": "string",
        "estimatedTime": "number",
        "priority": "number",
        "reasoning": "string",
        "prerequisites": ["string"]
      }
    ],
    "milestones": [
      {
        "title": "string",
        "targetDate": "ISO 8601 date",
        "requirements": ["string"]
      }
    ]
  }
}
```

### POST /api/learning/adapt
Adapt learning path based on performance.

**Request Body:**
```json
{
  "pathId": "string",
  "forceAdaptation": "boolean"
}
```

**Response:**
```json
{
  "success": true,
  "adaptedPath": {
    "id": "string",
    "adaptations": [
      {
        "timestamp": "ISO 8601 date",
        "reason": "string",
        "changes": ["string"],
        "addedProblems": ["string"],
        "removedProblems": ["string"]
      }
    ]
  }
}
```

---

## Interview Simulator

### POST /api/interview/create
Create a new interview session.

**Request Body:**
```json
{
  "type": "technical | system-design | behavioral | mixed",
  "difficulty": "junior | mid-level | senior | staff",
  "company": "string",
  "settings": {
    "allowHints": "boolean",
    "recordSession": "boolean",
    "companyStyle": "google | meta | amazon | microsoft | netflix | generic",
    "language": "string",
    "stressMode": "boolean"
  }
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "string",
    "type": "string",
    "difficulty": "string",
    "company": "string",
    "duration": "number",
    "problemCount": "number",
    "status": "scheduled",
    "settings": {}
  }
}
```

### POST /api/interview/:sessionId/start
Start an interview session.

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "string",
    "status": "in-progress",
    "startTime": "ISO 8601 date",
    "currentProblem": {
      "id": "string",
      "title": "string",
      "description": "string",
      "timeLimit": "number"
    }
  }
}
```

### POST /api/interview/:sessionId/submit
Submit solution for current problem.

**Request Body:**
```json
{
  "problemIndex": "number",
  "code": "string",
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "feedback": {
    "correctness": "number",
    "efficiency": "number",
    "codeQuality": "number",
    "suggestions": ["string"]
  },
  "score": "number"
}
```

### POST /api/interview/:sessionId/complete
Complete interview and get comprehensive feedback.

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "string",
    "status": "completed",
    "score": {
      "overall": "number",
      "breakdown": {
        "correctness": "number",
        "efficiency": "number",
        "clarity": "number",
        "communication": "number",
        "problemSolving": "number"
      },
      "percentile": "number"
    },
    "feedback": {
      "overall": {
        "rating": "number",
        "recommendation": "strong-hire | hire | no-hire | strong-no-hire",
        "summary": "string"
      },
      "technical": {},
      "behavioral": {},
      "areas": {
        "strengths": ["string"],
        "improvements": ["string"]
      },
      "recommendedNextSteps": ["string"]
    }
  }
}
```

---

## Collaboration

### POST /api/collaboration/session
Create collaborative coding session.

**Request Body:**
```json
{
  "problemId": "string",
  "settings": {
    "maxParticipants": "number",
    "allowChat": "boolean",
    "allowVoice": "boolean",
    "shareVideo": "boolean",
    "sessionType": "practice | mock-interview | pair-programming"
  }
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "string",
    "roomId": "string",
    "joinUrl": "string",
    "hostId": "string",
    "participants": [],
    "status": "waiting",
    "settings": {}
  }
}
```

### POST /api/collaboration/:sessionId/join
Join existing collaborative session.

**Request Body:**
```json
{
  "roomId": "string",
  "displayName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "string",
    "participants": [
      {
        "id": "string",
        "name": "string",
        "role": "host | participant | observer",
        "status": "active | away | disconnected"
      }
    ],
    "currentProblem": {},
    "sharedCode": "string"
  }
}
```

---

## Performance Monitoring

### POST /api/monitoring
Send performance metrics to monitoring service.

**Request Body:**
```json
{
  "metrics": [
    {
      "name": "string",
      "value": "number",
      "category": "api | render | database | cache | compute",
      "tags": {}
    }
  ],
  "errors": [
    {
      "error": "string",
      "context": {},
      "severity": "low | medium | high | critical"
    }
  ],
  "interactions": [
    {
      "type": "click | navigation | form_submit | api_call",
      "component": "string",
      "action": "string",
      "duration": "number"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "processed": {
    "metrics": "number",
    "errors": "number",
    "interactions": "number"
  }
}
```

### GET /api/monitoring/health
Get application health status.

**Response:**
```json
{
  "success": true,
  "health": {
    "status": "healthy | degraded | critical",
    "uptime": "number",
    "memory": {
      "heap": "number",
      "external": "number",
      "total": "number"
    },
    "performance": {
      "apiLatency": "number",
      "dbLatency": "number",
      "cacheHitRate": "number",
      "errorRate": "number"
    },
    "recommendations": ["string"]
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "string",
  "details": {}
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Please authenticate to access this resource"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "The requested resource was not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate Limited",
  "message": "Too many requests. Please try again later",
  "retryAfter": "number (seconds)"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- **Default Rate Limit**: 100 requests per minute per IP
- **Authenticated Rate Limit**: 500 requests per minute per user
- **Premium Rate Limit**: 2000 requests per minute per user

Rate limit information is included in response headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

---

## WebSocket Events

### Quiz Events
- `quiz:started` - Quiz session started
- `quiz:problemChanged` - Moved to next problem
- `quiz:hintUsed` - Hint was used
- `quiz:completed` - Quiz completed

### Collaboration Events
- `collab:userJoined` - User joined session
- `collab:userLeft` - User left session
- `collab:codeChanged` - Code was updated
- `collab:cursorMoved` - Cursor position changed
- `collab:chatMessage` - Chat message sent

### Interview Events
- `interview:started` - Interview began
- `interview:problemSubmitted` - Solution submitted
- `interview:interviewerMessage` - Interviewer sent message
- `interview:completed` - Interview ended

---

## Authentication

All authenticated endpoints require either:

1. **Bearer Token** in Authorization header:
   ```
   Authorization: Bearer <token>
   ```

2. **Session Cookie** (automatically handled by browser)

3. **API Key** for programmatic access:
   ```
   X-API-Key: <api_key>
   ```

---

## Versioning

The API uses URL versioning. Current version: `v1`

Future versions will be available at:
- `/api/v2/...`
- `/api/v3/...`

Deprecated endpoints will be marked with `X-Deprecated` header and sunset date.