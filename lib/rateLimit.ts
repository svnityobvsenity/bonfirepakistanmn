import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string // Custom key generator
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (for development/preview)
// In production, use Redis or similar
const store: RateLimitStore = {}

export class RateLimiter {
  private config: RateLimitConfig
  private store: RateLimitStore

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (req: NextRequest) => {
        // Default: use IP address
        return req.ip || req.headers.get('x-forwarded-for') || 'unknown'
      },
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config
    }
    this.store = store
  }

  private getKey(req: NextRequest): string {
    return this.config.keyGenerator!(req)
  }

  private isRateLimitExceeded(key: string): boolean {
    const now = Date.now()
    const record = this.store[key]

    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.windowMs
      }
      return false
    }

    if (record.count >= this.config.maxRequests) {
      return true
    }

    // Increment count
    record.count++
    return false
  }

  private getRemainingRequests(key: string): number {
    const record = this.store[key]
    if (!record) {
      return this.config.maxRequests
    }
    return Math.max(0, this.config.maxRequests - record.count)
  }

  private getResetTime(key: string): number {
    const record = this.store[key]
    return record ? record.resetTime : Date.now() + this.config.windowMs
  }

  async isAllowed(req: NextRequest): Promise<{
    allowed: boolean
    limit: number
    remaining: number
    resetTime: number
    retryAfter: number
  }> {
    const key = this.getKey(req)
    const isExceeded = this.isRateLimitExceeded(key)
    
    if (isExceeded) {
      const resetTime = this.getResetTime(key)
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000)
      
      return {
        allowed: false,
        limit: this.config.maxRequests,
        remaining: 0,
        resetTime,
        retryAfter
      }
    }

    const remaining = this.getRemainingRequests(key)
    const resetTime = this.getResetTime(key)
    
    return {
      allowed: true,
      limit: this.config.maxRequests,
      remaining,
      resetTime,
      retryAfter: 0
    }
  }

  middleware() {
    return (req: NextRequest) => {
      const key = this.getKey(req)

      if (this.isRateLimitExceeded(key)) {
        const resetTime = this.getResetTime(key)
        const retryAfter = Math.ceil((resetTime - Date.now()) / 1000)

        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            retryAfter,
            limit: this.config.maxRequests,
            windowMs: this.config.windowMs
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': this.config.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': resetTime.toString(),
              'Retry-After': retryAfter.toString()
            }
          }
        )
      }

      // Add rate limit headers
      const remaining = this.getRemainingRequests(key)
      const resetTime = this.getResetTime(key)

      const response = NextResponse.next()
      response.headers.set('X-RateLimit-Limit', this.config.maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', resetTime.toString())

      return response
    }
  }
}

// Pre-configured rate limiters
export const messageRateLimit = new RateLimiter({
  windowMs: 5000, // 5 seconds
  maxRequests: 5, // 5 messages per 5 seconds
  keyGenerator: (req: NextRequest) => {
    // Use user ID if available, otherwise IP
    const authHeader = req.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // In a real implementation, you'd decode the JWT to get user ID
      // For now, use a hash of the token
      return `user:${authHeader.substring(7).slice(0, 10)}`
    }
    return req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  }
})

export const authRateLimit = new RateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 5, // 5 auth attempts per minute
  keyGenerator: (req: NextRequest) => {
    return req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  }
})

export const friendRequestRateLimit = new RateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 10, // 10 friend requests per minute
  keyGenerator: (req: NextRequest) => {
    const authHeader = req.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return `user:${authHeader.substring(7).slice(0, 10)}`
    }
    return req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  }
})

// Utility function to apply rate limiting to API routes
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  rateLimiter: RateLimiter
) {
  return async (req: NextRequest) => {
    const rateLimitResult = rateLimiter.middleware()(req)
    
    if (rateLimitResult instanceof NextResponse && rateLimitResult.status === 429) {
      return rateLimitResult
    }

    return handler(req)
  }
}
