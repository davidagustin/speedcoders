// Mock Redis implementation for development
export class Redis {
  private cache = new Map();

  async get(key: string): Promise<string | null> {
    return this.cache.get(key) || null;
  }

  async set(key: string, value: string, ex?: number): Promise<string> {
    this.cache.set(key, value);
    if (ex) {
      setTimeout(() => {
        this.cache.delete(key);
      }, ex * 1000);
    }
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.cache.delete(key) ? 1 : 0;
  }

  async exists(key: string): Promise<number> {
    return this.cache.has(key) ? 1 : 0;
  }
}

export const redis = new Redis();