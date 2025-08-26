# SpeedCoders Architecture

## 🏗️ Project Structure

After the comprehensive refactor, the project follows a clean, maintainable architecture:

```
speedcoders/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── api/                      # API routes (minimal, focused)
│   │   ├── auth/                 # Auth endpoints
│   │   ├── leetcode/             # LeetCode data endpoints
│   │   ├── problems/             # Problem management
│   │   ├── progress/             # User progress tracking
│   │   └── quiz/                 # Quiz management
│   ├── components/               # Page-specific components
│   ├── dashboard/                # Dashboard pages
│   ├── leetcode/                 # LeetCode practice page
│   ├── quiz/                     # Quiz pages
│   └── lib/                      # App-specific utilities
│       └── prisma.ts             # Prisma client
│
├── lib/                          # Shared libraries
│   ├── config.ts                 # Application configuration
│   ├── data/                     # Data files
│   │   └── problems.ts           # Single source of truth for problems
│   ├── services/                 # Service layer
│   │   └── database.ts           # Centralized database operations
│   └── utils/                    # Utility functions
│
├── components/                   # Shared UI components
│   ├── ui/                       # Base UI components
│   ├── forms/                    # Form components
│   └── layout/                   # Layout components
│
├── types/                        # TypeScript definitions
│   └── index.ts                  # Centralized type definitions
│
├── utils/                        # Core utilities
│   ├── redis.ts                  # Redis caching
│   └── supabase/                 # Supabase client utilities
│
├── prisma/                       # Database schema
│   └── schema.prisma            
│
├── scripts/                      # Build and maintenance scripts
│   └── seed/                     # Database seeding scripts
│
└── public/                       # Static assets
```

## 🎯 Key Design Principles

### 1. Single Source of Truth
- **Problems Data**: All problem data is centralized in `lib/data/problems.ts`
- **Type Definitions**: All TypeScript interfaces in `types/index.ts`
- **Configuration**: Application settings in `lib/config.ts`

### 2. Separation of Concerns
- **API Routes**: Minimal, focused on HTTP handling
- **Service Layer**: Business logic in `lib/services/`
- **Database Layer**: All database operations through service layer
- **UI Components**: Clear separation between page and shared components

### 3. Performance Optimization
- **Caching**: Redis caching for frequently accessed data
- **Code Splitting**: Next.js automatic code splitting
- **Lazy Loading**: Components loaded on demand

## 📁 File Organization

### API Routes (`app/api/`)
Each route is minimal and delegates to service layer:
- Authentication (`/auth/*`)
- Problem management (`/problems/*`)
- Quiz operations (`/quiz/*`)
- Progress tracking (`/progress/*`)

### Components (`app/components/`)
Page-specific components organized by feature:
- `QuizCreator` - Quiz configuration
- `ProblemBrowser` - Problem search and filtering
- `LearningPath` - Personalized learning recommendations
- `EditorialView` - Solution explanations
- `QuizResults` - Quiz completion analytics

### Data Layer (`lib/data/`)
Centralized data management:
- `problems.ts` - All LeetCode problems and metadata
- Exported constants for categories, difficulties

### Service Layer (`lib/services/`)
Business logic abstraction:
- `database.ts` - All database operations
- Clean API for data access
- Error handling and validation

### Types (`types/index.ts`)
Comprehensive type definitions:
- Domain models (Problem, Quiz, User)
- API types (requests, responses)
- UI types (filters, configurations)

## 🔄 Data Flow

1. **User Request** → API Route
2. **API Route** → Service Layer
3. **Service Layer** → Database/Cache
4. **Service Layer** → Transform/Validate
5. **API Route** → Response
6. **Client** → UI Update

## 🚀 Performance Features

### Caching Strategy
- Redis for frequently accessed data
- TTL-based cache invalidation
- Lazy cache warming

### Database Optimization
- Indexed queries
- Batch operations
- Connection pooling

### Frontend Optimization
- Server-side rendering (SSR)
- Static generation where possible
- Progressive enhancement

## 🔒 Security

### Authentication
- Supabase Auth integration
- JWT-based sessions
- Protected API routes

### Data Validation
- Input sanitization
- Type checking
- SQL injection prevention

### Rate Limiting
- API rate limiting
- Request throttling
- DDoS protection

## 📊 Refactor Impact

### Before Refactor
- **Size**: ~1GB
- **Duplicate Files**: 15+ problem data files
- **Unused Code**: ~146MB
- **Build Time**: ~45 seconds

### After Refactor
- **Size**: ~860MB (14% reduction)
- **Single Source**: 1 problem data file
- **Clean Structure**: No unused code
- **Build Time**: ~30 seconds (33% faster)

## 🛠️ Development Guidelines

### Adding New Features
1. Define types in `types/index.ts`
2. Add service methods in `lib/services/`
3. Create minimal API route
4. Build UI components
5. Add tests

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

### Testing Strategy
- Unit tests for services
- Integration tests for API
- E2E tests for critical paths

## 📈 Future Improvements

### Short Term
- [ ] Complete component consolidation
- [ ] Add comprehensive testing
- [ ] Implement error boundaries
- [ ] Add loading states

### Medium Term
- [ ] GraphQL API layer
- [ ] Real-time features
- [ ] Advanced caching
- [ ] Performance monitoring

### Long Term
- [ ] Microservices architecture
- [ ] Multi-region deployment
- [ ] Machine learning integration
- [ ] Native mobile apps

## 📝 Migration Notes

### For Developers
- Import problems from `@/lib/data/problems`
- Use types from `@/types`
- Access config from `@/lib/config`
- Use DatabaseService for all DB operations

### Breaking Changes
- Problem data structure normalized
- API routes consolidated
- Component imports updated
- Seed scripts moved to `/scripts/seed/`

---

This architecture provides a solid foundation for scaling SpeedCoders while maintaining code quality and developer experience.