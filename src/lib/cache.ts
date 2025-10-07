// Simple in-memory cache for departure data
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class SimpleCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private ttl: number; // Time to live in milliseconds

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;

    if (age > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up old entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Cache for departure data - 2 minute TTL for real-time data
export const departuresCache = new SimpleCache<unknown>(2);

// Cache for route data (which trains stop where) - 60 minute TTL since routes don't change often
export const routeCache = new SimpleCache<boolean>(60);

// Periodically clean up old cache entries (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    departuresCache.cleanup();
    routeCache.cleanup();
  }, 5 * 60 * 1000);
}
