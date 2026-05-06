import 'server-only'

import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/** 5 uploads per hour per user */
export const uploadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'bd:upload',
})

/** 30 ratings per 10 minutes per user */
export const ratingLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '10 m'),
  prefix: 'bd:rating',
})

/** 10 auth attempts per 15 minutes per IP */
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '15 m'),
  prefix: 'bd:auth',
})
