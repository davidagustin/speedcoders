# SpeedCoders Deployment Guide

## 🚀 Vercel Preview Deployment

This project is configured for automatic preview deployments on Vercel using conventional commits and GitHub Actions.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Configure the following in Vercel

### Environment Variables

Set these in your Vercel project settings:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URL (if using Prisma)
DATABASE_URL=your_database_url

# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=your_app_url
```

### GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add the following secrets:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Getting Vercel Credentials

1. **Vercel Token**:
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token with appropriate permissions

2. **Org ID and Project ID**:
   - Run: `npx vercel link`
   - Check `.vercel/project.json` for the IDs

### Conventional Commits

This project uses conventional commits for automatic versioning and changelog generation.

#### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Revert commits
- `hotfix`: Critical bug fixes

#### Examples

```bash
# Feature
git commit -m "feat(quiz): add enhanced quiz interface with timer"

# Bug fix
git commit -m "fix(auth): resolve login redirect issue"

# Documentation
git commit -m "docs(readme): update deployment instructions"

# Breaking change
git commit -m "feat(api)!: change user endpoint response format

BREAKING CHANGE: The user endpoint now returns a different structure"
```

### Deployment Workflow

1. **Feature Branches**: Create feature branches from `develop`
2. **Commit Conventionally**: Use conventional commit format
3. **Push to GitHub**: Automatic preview deployment triggers
4. **Review**: Check the preview URL in PR comments
5. **Merge**: Merge to `develop` for staging, `main` for production

### Branch Strategy

```
main (production)
├── develop (staging)
│   ├── feature/new-quiz-system
│   ├── feature/leaderboard
│   └── bugfix/auth-issue
└── hotfix/critical-fix
```

### Preview URLs

- **Feature Branches**: `https://feature-branch-name.vercel.app`
- **PR Previews**: `https://pr-123.vercel.app`
- **Staging**: `https://develop.vercel.app`
- **Production**: `https://your-app.vercel.app`

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Database Setup

1. **Prisma Setup**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Seed Data**:
   ```bash
   npm run seed
   ```

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Configure Sentry or similar
- **Uptime Monitoring**: Set up health checks

### Security

- Environment variables are encrypted
- API routes have rate limiting
- CORS is properly configured
- Security headers are set

### Troubleshooting

#### Common Issues

1. **Build Failures**:
   - Check environment variables
   - Verify TypeScript compilation
   - Review dependency conflicts

2. **Deployment Issues**:
   - Ensure Vercel token is valid
   - Check GitHub secrets
   - Verify branch protection rules

3. **Database Connection**:
   - Verify DATABASE_URL
   - Check Supabase credentials
   - Ensure database is accessible

#### Debug Commands

```bash
# Check Vercel configuration
npx vercel --debug

# Verify environment variables
npx vercel env ls

# Test build locally
npm run build

# Check TypeScript
npx tsc --noEmit
```

### Performance Optimization

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Implement dynamic imports
3. **Caching**: Configure appropriate cache headers
4. **CDN**: Vercel provides global CDN

### Backup Strategy

1. **Database**: Regular Supabase backups
2. **Code**: GitHub repository
3. **Environment**: Document all configurations
4. **Assets**: Store in version control or CDN

### Rollback Procedure

1. **Vercel Dashboard**: Use the rollback feature
2. **Git Revert**: Create a revert commit
3. **Database**: Restore from backup if needed

### Support

For deployment issues:
1. Check Vercel documentation
2. Review GitHub Actions logs
3. Contact the development team
4. Create an issue in the repository

---

**Remember**: Always test in preview environment before deploying to production!
