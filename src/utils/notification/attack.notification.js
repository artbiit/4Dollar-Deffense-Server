import { PacketType } from '../../constants/header.js';
import makeNotification from './makeNotification.js';

// enemyTowerAttackNotification
export const createEnemyTowerAttackNotification = (monsterId, towerId, user) => {
  const packetType = PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION;
  const payload = { monsterId, towerId };
  return makeNotification(packetType, payload, user);
};
