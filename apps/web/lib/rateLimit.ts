import { Redis } from '@upstash/redis'
import { Ratelimit } from "@upstash/ratelimit"


const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export const authRateLimit = new Ratelimit({
    redis : redis,
    limiter : Ratelimit.slidingWindow(5, '15 m'),
    prefix : "rateLimit:login"
})


export const payRateLimit = new Ratelimit({
    redis,
    limiter : Ratelimit.slidingWindow(10, '15 m'),
    prefix : "rateLimit:pay"
})


