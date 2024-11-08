import { getGameSessionByUser } from '../../session/game.session.js';
import Tower from '../../classes/models/tower.class.js';
import { getUserBySocket } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handleError } from '../../utils/error/errorHandler.js';
import configs from '../../configs/configs.js';
import { createAddEnemyTowerNotification } from '../../utils/notification/tower.notification.js';
import Result from '../result.js';

const { PacketType } = configs;

/**
 * C2STowerPurchaseRequest 요청을 받아서 다음 작업을 수행하는 핸들러:
 * 1. 해당 요청을 보낸 유저 (타워를 설치한 유저)에게 S2CTowerPurchaseResponse 응답 패킷을 전송
 * 2. 상대방 유저에게 S2CAddEnemyTowerNotification 알림 패킷을 전송
 * @param {{socket: net.Socket, payload: {x: number, y: number}}}
 */
const towerPurchaseHandler = ({ socket, payload }) => {
  try {
    const { x, y } = payload;

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

    // INCOMPLETE: 게임이 진행중인지 검증 필요
    // INCOMPLETE: 타워 위치 (설치할 수 있는 곳인가? 다른 타워와 겹치는가?) 검증 필요
    // INCOMPLETE: 골드가 충분한지 검증 필요

    const tower = new Tower({ x, y });
    gameSession.addTower(user, tower);

    // 검증: 상대방 유저가 존재함
    const opponent = gameSession.getOpponent(user.id);
    const opponentSocket = opponent.socket;
    if (!opponent || !opponentSocket) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    // 적 타워 설치 알림 패킷 전송
    const addEnemyTowerResponse = createAddEnemyTowerNotification(opponent, tower);
    opponentSocket.write(addEnemyTowerResponse);

    // 타워 설치 응답 패킷 전송
    const towerPurchaseResponseData = { towerId: tower.instanceId };
    const result = new Result(towerPurchaseResponseData, PacketType.TOWER_PURCHASE_RESPONSE);
    return result;
  } catch (error) {
    handleError(PacketType.TOWER_PURCHASE_REQUEST, error);
  }
};

export default towerPurchaseHandler;
