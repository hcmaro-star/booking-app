import { createClient, RedisClientType } from 'redis';

declare global {
  // eslint-disable-next-line no-var
  var _redis: RedisClientType | undefined;
}

const client = global._redis ?? createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('Redis error:', err));

if (!global._redis) {
  client.connect().catch(console.error);
  global._redis = client;
}

export default client;
