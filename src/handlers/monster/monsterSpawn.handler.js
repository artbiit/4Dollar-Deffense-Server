import { addMonsterToGameSession, getGameSessionByUser } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { stateSyncNotification } from '../../utils/notification/stateSync.notification.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handleError } from '../../utils/error/errorHandler.js';
import config from '../../configs/configs.js';
import Result from '../result.js';

const { PacketType } = config;

export const spawnMonsterRequestHandler = ({ socket, payload }) => {
  try {
    console.log('33333333');
    // 검증: 유저가 존재함
    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
    console.log('33333333-1');
    // 검증: 유저가 게임에 참가함
    const gameSession = getGameSessionByUser(user);
    if (!gameSession) {
      throw new CustomError(ErrorCodes.USER_NOT_IN_GAME, '유저가 플레이중인 게임이 없습니다.');
    }
    console.log('33333333-2');
    // 1~5 사이의 monsterNumber 생성
    const monsterNumber = Math.floor(Math.random() * 5) + 1;
    console.log('33333333-3');
    // 게임 세션에 몬스터 추가
    const monsterId = addMonsterToGameSession(socket, monsterNumber);
    console.log('33333333-4');
    if (monsterId) {
      console.log(`몬스터 추가 됨 : ${monsterId}`);
      console.log('33333333-5');
      // 상태동기화
      const stateSyncOpponentSocket = gameSession.getOpponent(user.id);
      stateSyncOpponentSocket.write(stateSyncNotification(gameSession.getPlayerData(user.id)));
      console.log('33333333-6');
      return new Result({ monsterId, monsterNumber }, PacketType.SPAWN_MONSTER_RESPONSE);
    }
  } catch (error) {
    console.log('33333333-7');
    handleError(PacketType.SPAWN_MONSTER_REQUEST, error);
  }
};
/* message S2CSpawnMonsterResponse {
    int32 monsterId = 1;
    int32 monsterNumber = 2;
    }
    monsterId는 고유한 값으로 관리를 위해서 보내주면 되고
    monsterNumber는 1~5사이 값 아무거나 보내면 클라이언트에서 매핑해주셔가지고 MON00001 이런식으로 해결해주신다고 합니다. */
