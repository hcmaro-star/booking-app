// lib/redis.ts
import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set. Check your .env.local or Vercel env.");
}

// ioredis 는 rediss:// 를 쓰면 TLS 자동 적용됩니다.
export const redis = new Redis(process.env.REDIS_URL);

export default redis;
