import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export default redis

// Cache keys
export const CACHE_KEYS = {
  PROBLEMS: 'problems',
  ALGORITHMS: 'algorithms',
  QUIZZES: 'quizzes',
  REGEX_EXERCISES: 'regex_exercises',
  LANGUAGE_TRICKS: 'language_tricks',
  FRONTEND_TRICKS: 'frontend_tricks',
  USER_STATS: (userId: string) => `user_stats:${userId}`,
  LEADERBOARD: 'leaderboard',
} as const

// Cache durations (in seconds)
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const