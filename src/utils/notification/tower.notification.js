import makeNotification from './makeNotification.js';
import configs from '../../configs/configs.js';

/**
 * S2CAddEnemyTowerNotification 패킷을 생성하는 함수
 * @param {User} user 알림을 받을 유저
 * @param {Tower} tower 설치된 적 타워
 * @returns {Buffer} 전송할 패킷
 */
export const createAddEnemyTowerNotification = (user, tower) => {
  const packetType = configs.PacketType.ADD_ENEMY_TOWER_NOTIFICATION;
  const payload = { towerId: tower.instanceId, x: tower.x, y: tower.y };
  return makeNotification(packetType, payload, user);
};
