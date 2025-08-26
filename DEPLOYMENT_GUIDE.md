# Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Security Requirements (CRITICAL)
- [ ] **Remove code execution vulnerability** from `app/lib/code-execution.ts`
- [ ] **Add authentication** to all API routes
- [ ] **Implement input validation** with Zod schemas
- [ ] **Configure HTTPS** and security headers
- [ ] **Set up CORS** properly
- [ ] **Hide sensitive environment variables**
- [ ] **Enable SQL injection protection**
- [ ] **Configure CSP headers**

### ✅ Performance Requirements
- [ ] **Implement code splitting** with React.lazy()
- [ ] **Add server-side pagination** for large datasets
- [ ] **Configure caching** strategies
- [ ] **Optimize images** with Next.js Image
- [ ] **Bundle size < 500KB** initial load
- [ ] **First Contentful Paint < 1.5s**
- [ ] **Core Web Vitals** passing scores

### ✅ Database & Infrastructure
- [ ] **Database migrations** completed
- [ ] **Connection pooling** configured
- [ ] **Backup strategy** implemented
- [ ] **Monitoring** setup (logs, metrics, alerts)
- [ ] **CDN** configured for static assets
- [ ] **Environment separation** (dev/staging/prod)

## Production Architecture

### Recommended Infrastructure Stack
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=speedcoders
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### Production Dockerfile
```dockerfile
# Dockerfile.prod
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## Environment Configuration

### Production Environment Variables
```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://speedcoders.com

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/speedcoders_prod"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="super-secret-production-key-min-32-chars"
NEXTAUTH_URL="https://speedcoders.com"
JWT_SECRET="jwt-secret-key-production"

# Security
ENCRYPTION_KEY="32-char-encryption-key-for-prod"
CORS_ORIGIN="https://speedcoders.com"

# External Services
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="noreply@speedcoders.com"
SMTP_PASSWORD="app-specific-password"

# Analytics & Monitoring
ANALYTICS_ID="GA-MEASUREMENT-ID"
SENTRY_DSN="https://your-sentry-dsn"
LOGFLARE_API_KEY="your-logflare-key"

# Payment Processing
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI Services (if implemented)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
```

### Next.js Production Config
```javascript
// next.config.prod.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react'],
  },

  // Image optimization
  images: {
    domains: ['speedcoders.com', 'cdn.speedcoders.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Compression
  compress: true,

  // PWA configuration
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
};

module.exports = nextConfig;
```

## Database Setup

### Production Migration Script
```sql
-- migrations/001_initial_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  subscription_tier VARCHAR(50) DEFAULT 'free'
);

-- Problems table
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  examples JSONB,
  constraints TEXT[],
  solutions JSONB,
  hints JSONB,
  tags VARCHAR(50)[],
  leetcode_id INTEGER,
  acceptance_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  solved BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  best_solution TEXT,
  best_time INTEGER, -- milliseconds
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- Quiz sessions
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  selected_algorithms VARCHAR(100)[],
  selected_difficulties VARCHAR(20)[],
  time_limit INTEGER,
  problems JSONB,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0
);

-- Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  stripe_subscription_id VARCHAR(255),
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_category ON problems(category);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_problem_id ON user_progress(problem_id);
CREATE INDEX idx_quiz_sessions_user_id ON quiz_sessions(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
```

### Database Connection Pool
```typescript
// lib/db-pool.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;
```

## Monitoring & Logging

### Application Monitoring
```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service
    }
  },
  error: (message: string, error?: Error, data?: any) => {
    console.error(`[ERROR] ${message}`, error, data);
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error || new Error(message), {
        extra: data,
      });
    }
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },
};
```

### Performance Monitoring
```typescript
// lib/performance.ts
export const reportWebVitals = (metric: any) => {
  const { name, value, id } = metric;
  
  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      event_label: id,
      non_interaction: true,
    });
  }

  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, value, id }),
    });
  }
};
```

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type check
        run: npm run type-check
        
      - name: Run linting
        run: npm run lint
        
      - name: Run tests
        run: npm run test:ci
        
      - name: Run security audit
        run: npm audit --audit-level high
        
      - name: Build application
        run: npm run build
        
      - name: Run E2E tests
        run: npm run test:e2e:ci

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Add deployment commands
```

## Deployment Steps

### 1. Pre-deployment Security Fixes
```bash
# CRITICAL: Fix security vulnerabilities first
git checkout -b security-fixes

# Remove dangerous code execution
# Edit app/lib/code-execution.ts
# Replace unsafe execution with server-side sandboxing

# Add authentication to API routes
# Edit all files in app/api/
# Add authentication middleware

# Commit security fixes
git add .
git commit -m "SECURITY: Fix critical vulnerabilities"
git push origin security-fixes
```

### 2. Database Setup
```bash
# Create production database
psql -h your-db-host -U your-user -d postgres
CREATE DATABASE speedcoders_prod;

# Run migrations
npm run db:migrate:prod

# Seed initial data
npm run db:seed:prod
```

### 3. Build and Deploy
```bash
# Build production bundle
npm run build

# Run pre-deployment tests
npm run test:prod

# Deploy with Docker
docker-compose -f docker-compose.prod.yml up -d

# Or deploy to cloud platform
# Vercel: vercel --prod
# Netlify: netlify deploy --prod
# AWS: aws deploy create-deployment
```

### 4. Post-deployment Verification
```bash
# Health check
curl https://speedcoders.com/api/health

# Performance check
lighthouse https://speedcoders.com --view

# Security scan
npm audit --registry=https://registry.npmjs.org/

# Monitor logs
docker logs speedcoders_app --follow
```

## Scaling Considerations

### Horizontal Scaling Setup
```yaml
# kubernetes/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: speedcoders-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: speedcoders
  template:
    metadata:
      labels:
        app: speedcoders
    spec:
      containers:
      - name: app
        image: speedcoders:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: speedcoders-service
spec:
  selector:
    app: speedcoders
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

### CDN Configuration
```javascript
// Configure CDN for static assets
const CDN_CONFIG = {
  domains: ['cdn.speedcoders.com'],
  cacheTTL: {
    images: '30d',
    scripts: '1y',
    styles: '1y',
    fonts: '1y',
  },
  compression: ['gzip', 'brotli'],
  minification: true,
};
```

## Disaster Recovery Plan

### Backup Strategy
```bash
# Daily database backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Upload to cloud storage
aws s3 cp backup-$(date +%Y%m%d).sql s3://speedcoders-backups/

# Keep 30 days of backups
```

### Recovery Procedures
```bash
# Database restore
psql $DATABASE_URL < backup-YYYYMMDD.sql

# Application rollback
docker-compose down
docker-compose up -d --build
```

## Success Metrics

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Reliability Targets
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%
- **Response Time**: < 200ms (API)
- **Database Performance**: < 50ms (average query)

This deployment guide ensures a secure, performant, and scalable production environment for the SpeedCoders platform.