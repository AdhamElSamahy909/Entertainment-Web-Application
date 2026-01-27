import redisClient from "../config/redisConfig.js";

export async function getCache(key: string): Promise<string | null> {
  if (!redisClient.isOpen) return null;

  try {
    return await redisClient.get(key);
  } catch (error) {
    console.warn(`Rdis Get Error for key ${key}: `, error);
    return null;
  }
}

export async function setCache(key: string, value: string, ttl: number = 3600) {
  if (!redisClient.isOpen) return;

  try {
    await redisClient.setEx(key, ttl, value);
  } catch (error) {
    console.warn(`Redis Set Error for key ${key}: `, error);
  }
}

export async function blockToken(token: string, expTimeStamp: number) {
  if (!redisClient.isOpen) {
    console.warn("Redis is down. Cannot blacklist token: ", token);
    return;
  }

  try {
    redisClient.set(token, "blacklisted", {
      expiration: { type: "EXAT", value: expTimeStamp },
    });
  } catch (error) {
    console.log("Failed to blacklist token in Redis: ", error);
  }
}

export async function isTokenBlocked(token: string): Promise<boolean> {
  if (!redisClient.isOpen) return false;

  try {
    const result = await redisClient.get(token);
    return result === "blacklisted";
  } catch (error) {
    console.log("Failed to check if token is blocked: ", error);
    return false;
  }
}
