import logger from '../../utils/logger.js';
import { getRedis } from '../redis.js';

const SESSION_LIST_KEY = 'GameSessions';
export const cacheGameSession = async (uuid) => {
  const redis = await getRedis();
  redis.rpush(`${SESSION_LIST_KEY}`, uuid);
};

export const unlinkGameSession = async (uuid) => {
  const redis = await getRedis();
  try {
    redis.lrem(SESSION_LIST_KEY, 0, uuid);
  } catch (error) {
    logger.error(`removeGameSession. ${error}`);
  }
};
