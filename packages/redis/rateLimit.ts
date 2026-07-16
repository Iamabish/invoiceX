import  { connection } from "./connection"

export async function rateLimit(
  ip: string,
  options?: { limit?: number; windowSeconds?: number }
) {

  try {
    const limit = options?.limit ?? 10;
    const windowSeconds = options?.windowSeconds ?? 15 * 60;
  
    const key = `rate-limit:${ip}`;
    const requests = await connection.incr(key);
  
    if (requests === 1) {
      await connection.expire(key, windowSeconds, 'NX');
    }
  
    if (requests > limit) {
      return { success: false, remaining: 0 };
    }
  
    return { success: true, remaining: limit - requests };
  } catch (error) {
    console.log('Rate limit error', error);
    throw error
  }
}