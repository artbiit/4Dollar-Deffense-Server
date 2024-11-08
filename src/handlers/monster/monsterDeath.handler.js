import configs from '../../configs/configs.js';
import { getGameSessionByUser } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createEnemyMonsterDeathNotification } from '../../utils/notification/monster.notification.js';

const { PacketType } = configs;

/**
 * C2SMonsterDeathNotification 알림을 받아서 다음 작업을 수행하는 핸들러:
 * 1. 해당 몬스터가 실제로 죽었는지 검증
 * 2. 상대방 유저에게 S2CEnemyMonsterDeathNotification 알림 패킷을 전송
 * @param {{socket: net.Socket, payload: {monsterId: number}}}
 */
const monsterDeathHandler = ({ socket, payload }) => {
  try {
    const { monsterId } = payload;

    // 검증: 유저가 존재함
    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    // 검증: 유저가 게임에 참가함
    const gameSession = getGameSessionByUser(user);
    if (!gameSession) {
      throw new CustomError(ErrorCodes.USER_NOT_IN_GAME, '유저가 플레이중인 게임이 없습니다.');
    }

    // 검증: 게임이 진행중임
    const gameState = gameSession.state;
    if (gameState != 'in_progess') {
      throw new CustomError(ErrorCodes.GAME_NOT_IN_PROGRESS, `진행중인 게임이 아닙니다.`);
    }

    // 검증: 몬스터가 존재함
    const monster = gameSession.getMonster(user.id, monsterId);
    if (!monster) {
      throw new CustomError(ErrorCodes.MONSTER_NOT_FOUND, '몬스터를 찾을 수 없습니다.');
    }

    // 검증: 몬스터가 실제로 사망함
    if (monster.isAlive) {
      throw new CustomError(ErrorCodes.MONSTER_NOT_DEAD, '몬스터가 죽지 않았습니다.');
    }

    // 검증: 상대방 유저가 존재함
    const opponent = gameSession.getOpponent(user.id);
    const opponentSocket = opponent.user.socket;
    if (!opponent || !opponentSocket) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    // 상대방에게 적 몬스터 처치 알림 패킷 전송
    const enemyTowerDeathNotification = createEnemyMonsterDeathNotification(opponent, monster);
    opponentSocket.write(enemyTowerDeathNotification);
  } catch (error) {
    handleError(PacketType.MONSTER_DEATH_NOTIFICATION, error);
  }
};

export default monsterDeathHandler;
