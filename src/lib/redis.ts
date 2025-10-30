// src/lib/redis.ts
import Redis from "ioredis";

const url = process.env.REDIS_URL;
if (!url) {
  throw new Error("REDIS_URL is not set");
}

export const redis = new Redis(url, {
  // rediss:// 이면 TLS 강제
  tls: url.startsWith("rediss://") ? {} : undefined,
  // 운영에서 너무 오래 기다리지 않도록
  maxRetriesPerRequest: 2,
  enableReadyCheck: true,
  lazyConnect: false,
});
