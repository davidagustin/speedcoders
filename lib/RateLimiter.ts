import redis from "./redis";

interface RateLimitConfig {
	windowMs: number; // Time window in milliseconds
	maxRequests: number; // Maximum requests per window
	keyGenerator?: (req: Request) => string; // Custom key generator
}

export class RateLimiter {
	private config: RateLimitConfig;

	constructor(config: RateLimitConfig) {
		this.config = config;
	}

	async checkLimit(identifier: string): Promise<{
		allowed: boolean;
		remaining: number;
		resetTime: number;
	}> {
		const key = `rate_limit:${identifier}`;
		const now = Date.now();
		const window = Math.floor(now / this.config.windowMs);
		const windowKey = `${key}:${window}`;

		try {
			// Get current count
			const current = await redis.get(windowKey);
			const count = current ? parseInt(current as string) : 0;

			if (count >= this.config.maxRequests) {
				return {
					allowed: false,
					remaining: 0,
					resetTime: (window + 1) * this.config.windowMs,
				};
			}

			// Increment counter
			const newCount = await redis.incr(windowKey);

			// Set expiration on first request
			if (newCount === 1) {
				await redis.expire(windowKey, Math.ceil(this.config.windowMs / 1000));
			}

			return {
				allowed: true,
				remaining: this.config.maxRequests - newCount,
				resetTime: (window + 1) * this.config.windowMs,
			};
		} catch (error) {
			console.error("Rate limit check error:", error);
			// On error, allow the request (fail open)
			return {
				allowed: true,
				remaining: this.config.maxRequests - 1,
				resetTime: (window + 1) * this.config.windowMs,
			};
		}
	}

	static createMiddleware(config: RateLimitConfig) {
		const limiter = new RateLimiter(config);

		return async (request: Request): Promise<Response | null> => {
			const identifier = config.keyGenerator
				? config.keyGenerator(request)
				: request.headers.get("x-forwarded-for") || "anonymous";

			const { allowed, remaining, resetTime } =
				await limiter.checkLimit(identifier);

			if (!allowed) {
				return new Response(
					JSON.stringify({
						error: "Too many requests",
						retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
					}),
					{
						status: 429,
						headers: {
							"Content-Type": "application/json",
							"X-RateLimit-Limit": config.maxRequests.toString(),
							"X-RateLimit-Remaining": "0",
							"X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
							"Retry-After": Math.ceil(
								(resetTime - Date.now()) / 1000,
							).toString(),
						},
					},
				);
			}

			// Add rate limit headers to successful responses
			const headers = {
				"X-RateLimit-Limit": config.maxRequests.toString(),
				"X-RateLimit-Remaining": remaining.toString(),
				"X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
			};

			// Store headers in request for later use
			(request as any).rateLimitHeaders = headers;

			return null; // Continue to next middleware
		};
	}
}

// Pre-configured rate limiters
export const apiRateLimiter = new RateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 100,
});

export const quizRateLimiter = new RateLimiter({
	windowMs: 60 * 1000, // 1 minute
	maxRequests: 10,
});

export const authRateLimiter = new RateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 5, // Strict limit for auth attempts
});
