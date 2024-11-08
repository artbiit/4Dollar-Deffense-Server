import { getRedis } from '../redis.js';
import configs from '../../configs/configs.js';
import logger from '../../utils/logger.js';

const { REDIS_MATCH_REQUEST_CHANNEL } = configs;

/**매치메이킹 대기열 키*/
const WAITING_KEY = 'match_queue';
/** 매치메이킹 점수 정렬 키 */
const MATCH_SCORE_KEY = 'match_scores';

/**매치메이킹 등록 함수 */
export const enqueueMatchMaking = async (userId, bestScore) => {
  if (!userId) {
    throw new Error('userId must be defined');
  }

  if (bestScore === undefined || bestScore === null || Number.isNaN(bestScore)) {
    throw new Error(`bestScore must be defined : ${bestScore}[${typeof bestScore}]`);
  }
  const redis = await getRedis();

  const multi = redis.multi();

  multi.rpush(WAITING_KEY, userId);
  multi.zadd(MATCH_SCORE_KEY, bestScore, userId);
  await multi.exec(); //둘다 정상실행 되면

  redis.publish(REDIS_MATCH_REQUEST_CHANNEL, userId);
};

/** 대기열에 등록된 유저 정보 */
export const dequeueMatchMaking = async () => {
  const redis = await getRedis();

  const userId = await redis.lpop(WAITING_KEY);
  if (!userId) {
    logger.warn('dequeueMatchMaking. lPop is empty');
    return null;
  }

  const userScore = await redis.zscore(MATCH_SCORE_KEY, userId);

  if (!userScore) {
    logger.warn(`dequeueMatchMaking. could not found Score : ${userId}`);
    return null;
  }

  return { userId, userScore };
};

/** 대기열 인원 수 반환 */
export const getQueueCount = async () => {
  const redis = await getRedis();
  const queueLength = await redis.llen(WAITING_KEY);
  return queueLength;
};

/** 해당 유저 정보 제거 */
export const removeUserScore = async (userId) => {
  const redis = await getRedis();
  const removedCount = await redis.zrem(MATCH_SCORE_KEY, userId);
  return removedCount;
};

/** 범위내 유저 정보 탐색 */
export const GetUsersByScoreRange = async (minScore, maxScore, limit = 10) => {
  const redis = await getRedis();
  return await redis.zrangebyscore(
    MATCH_SCORE_KEY,
    minScore,
    maxScore,
    'WITHSCORES',
    'LIMIT',
    0, // 시작 위치
    limit, // 가져올 유저 수 제한
  );
};

export const getUserScore = async (userId) => {
  const redis = await getRedis();
  return await redis.zscore(MATCH_SCORE_KEY, userId);
};

/**
 *  명시된 모든 유저를 매칭에서 제거
 */
export const removeUsers = async (...userIds) => {
  const redis = await getRedis();

  const multi = redis.multi();

  for (let userId of userIds) {
    userId = String(userId);

    if ((await redis.lpos(WAITING_KEY, userId)) !== null) {
      multi.lrem(WAITING_KEY, 0, userId);
    }

    if ((await redis.zscore(MATCH_SCORE_KEY, userId)) !== null) {
      multi.zrem(MATCH_SCORE_KEY, userId);
    }
  }
  return await multi.exec();
};
