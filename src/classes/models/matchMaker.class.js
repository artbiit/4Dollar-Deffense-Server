import configs from '../../configs/configs.js';
import logger from '../../utils/logger.js';
import { getRedis } from '../../db/redis.js';
import {
  dequeueMatchMaking,
  getQueueCount,
  GetUsersByScoreRange,
  getUserScore,
  removeUsers,
} from '../../db/match/match.redis.js';
import { getUserById } from '../../session/user.session.js';

const { REDIS_MATCH_REQUEST_CHANNEL } = configs;

class MatchMaker {
  constructor() {}

  async init() {
    const redis = await getRedis();
    await redis.subscribe(REDIS_MATCH_REQUEST_CHANNEL);
    redis.on('message', async (channel, message) => {
      if (channel === REDIS_MATCH_REQUEST_CHANNEL) {
        await this.#matchMaking();
      }
    });
    logger.info('MatchMaker initialized');
  }

  #matchMaking = async () => {
    let queueCount = await getQueueCount();
    //1명이면 매칭이 불가능함
    if (queueCount < 2) {
      return;
    }
    //유저 정보 없으면 쿼리 중에 소거된 것이니 작업 취소
    const userId = await dequeueMatchMaking();
    if (!userId) {
      return;
    }

    try {
      let range = 50;
      let tryCount = 0;
      while (true) {
        const user = getUserById(userId);
        //연결이 해제 되었으면 작업 취소
        if (!user) {
          break;
        }

        let userScore = getUserScore(userId);
        //연결해제든, 이미 다른 곳에서 매칭된 것이든 작업 취소
        if (!userScore) {
          break;
        }
        userScore = Number(userScore);

        const rangeUsers = await GetUsersByScoreRange(userScore - range, userScore + range, 5);

        if (rangeUsers) {
          let closestUser = null;
          let minSocreDiff = Infinity;
          for (let i = 0; i < rangeUsers.length; i += 2) {
            const rUserId = rangeUsers[i];
            const rUser = getUserById(rUserId);
            if (rUserId === userId || !rUser) {
              continue;
            }
            const rScore = Number(rangeUsers[i + 1]);

            const scoreDiff = Math.abs(userScore - rScore);

            if (scoreDiff < minSocreDiff) {
              minSocreDiff = scoreDiff;
              closestUser = rUser;
            }
          }

          if (closestUser) {
            //매칭
            await removeUsers([userId, closestUser.id]);
            //게임에 유저 등록 후 시작 하기
            break;
          }
        }
        //점진적 범위 증가
        range = 50 + tryCount++ * tryCount * 100;
        await Promise.resolve((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      logger.error(`MatchMaker. ${error}`);
    }
  };
}
