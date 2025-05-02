// lib/redis.ts
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})


export async function getCachedData<T>(key: string): Promise<T | null> {
  const data = await redis.get(key)
  return data as T | null 
}

export async function setCachedData(key: string, data: any, ttl?: number): Promise<void> {
  if (ttl) {
    await redis.setex(key, ttl, data) 
  } else {
    await redis.set(key, data)
  }
}