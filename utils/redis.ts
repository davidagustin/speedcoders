import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

// Cache keys
export const CACHE_KEYS = {
	PROBLEMS: "problems",
	ALGORITHMS: "algorithms",
	QUIZ: (id: string) => `quiz:${id}`,
	USER_PROGRESS: (userId: string) => `user_progress:${userId}`,
	QUIZ_RESULTS: (quizId: string) => `quiz_results:${quizId}`,
} as const;

// Cache TTL in seconds
export const CACHE_TTL = {
	PROBLEMS: 3600, // 1 hour
	ALGORITHMS: 7200, // 2 hours
	QUIZ: 1800, // 30 minutes
	USER_PROGRESS: 900, // 15 minutes
	QUIZ_RESULTS: 86400, // 24 hours
} as const;
