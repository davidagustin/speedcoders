import redis, { CACHE_KEYS, CACHE_TTL } from './redis'

export class CacheService {
  private static instance: CacheService
  
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key)
      return cached ? JSON.parse(cached as string) : null
    } catch (error) {
      console.warn('Cache get error:', error)
      return null
    }
  }

  async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn('Cache set error:', error)
      return false
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.warn('Cache delete error:', error)
      return false
    }
  }

  async deletePattern(pattern: string): Promise<boolean> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
      return true
    } catch (error) {
      console.warn('Cache delete pattern error:', error)
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      console.warn('Cache exists error:', error)
      return false
    }
  }

  // High-level cache methods
  async cacheProblems(problems: any[], filters: Record<string, any> = {}): Promise<void> {
    const key = `${CACHE_KEYS.PROBLEMS}:${JSON.stringify(filters)}`
    await this.set(key, problems, CACHE_TTL.LONG)
  }

  async getCachedProblems(filters: Record<string, any> = {}): Promise<any[] | null> {
    const key = `${CACHE_KEYS.PROBLEMS}:${JSON.stringify(filters)}`
    return this.get(key)
  }

  async invalidateProblemsCache(): Promise<void> {
    await this.deletePattern(`${CACHE_KEYS.PROBLEMS}:*`)
  }

  async cacheAlgorithms(algorithms: any[]): Promise<void> {
    await this.set(CACHE_KEYS.ALGORITHMS, algorithms, CACHE_TTL.VERY_LONG)
  }

  async getCachedAlgorithms(): Promise<any[] | null> {
    return this.get(CACHE_KEYS.ALGORITHMS)
  }

  async cacheUserStats(userId: string, stats: any): Promise<void> {
    const key = CACHE_KEYS.USER_STATS(userId)
    await this.set(key, stats, CACHE_TTL.SHORT)
  }

  async getCachedUserStats(userId: string): Promise<any | null> {
    const key = CACHE_KEYS.USER_STATS(userId)
    return this.get(key)
  }

  async invalidateUserStats(userId: string): Promise<void> {
    const key = CACHE_KEYS.USER_STATS(userId)
    await this.delete(key)
  }
}