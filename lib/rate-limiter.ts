import { db } from './db';
import { rateLimits } from './db/schema';
import { eq } from 'drizzle-orm';

export class RateLimitError extends Error {
  statusCode = 429;
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

export class RateLimiter {
  private readonly defaultMax = 100;
  private readonly defaultWindowMs = 15 * 60 * 1000; // 15 minutes

  public async checkLimit(
    key: string,
    config?: { maxRequests?: number; windowMs?: number }
  ): Promise<RateLimitResult> {
    const maxRequests = config?.maxRequests ?? this.defaultMax;
    const windowMs = config?.windowMs ?? this.defaultWindowMs;

    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);

    try {
      const [record] = await db
        .select()
        .from(rateLimits)
        .where(eq(rateLimits.key, key))
        .limit(1);

      // No record or window expired → reset
      if (!record || record.resetAt <= now) {
        await db
          .insert(rateLimits)
          .values({ key, count: 1, resetAt })
          .onConflictDoUpdate({
            target: rateLimits.key,
            set: { count: 1, resetAt, updatedAt: now },
          });

        return {
          allowed: true,
          limit: maxRequests,
          remaining: maxRequests - 1,
          reset: resetAt,
        };
      }

      // Limit exceeded
      if (record.count >= maxRequests) {
        return {
          allowed: false,
          limit: maxRequests,
          remaining: 0,
          reset: record.resetAt,
        };
      }

      // Increment count
      await db
        .update(rateLimits)
        .set({ count: record.count + 1, updatedAt: now })
        .where(eq(rateLimits.key, key));

      return {
        allowed: true,
        limit: maxRequests,
        remaining: maxRequests - (record.count + 1),
        reset: record.resetAt,
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      return {
        allowed: true,
        limit: maxRequests,
        remaining: maxRequests,
        reset: resetAt,
      };
    }
  }

  public async enforce(key: string, config?: { maxRequests?: number; windowMs?: number }): Promise<void> {
    const result = await this.checkLimit(key, config);
    if (!result.allowed) {
      throw new RateLimitError('Too many attempts. Try again later.');
    }
  }

  public getHeaders(result: RateLimitResult): Record<string, string> {
    return {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.getTime().toString(),
    };
  }
}