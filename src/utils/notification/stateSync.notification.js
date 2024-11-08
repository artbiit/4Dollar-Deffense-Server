import { PacketType } from '../../constants/header.js';
import makeNotification from './makeNotification.js';

/**
 * 기지 HP 상태 변경 중계 패킷 (S2CUpdateBaseHPNotification)
 * @param {number} userGold
 * @param {number} baseHp
 * @param {number} monsterLevel
 * @param {number} score
 * @param {TowerData} towers
 * @param {MonsterData} monsters
 * @returns
 */
export const stateSyncNotification = async (
  userGold,
  baseHp,
  monsterLevel,
  score,
  towers,
  monsters,
  user,
) => {
  const packetType = PacketType.STATE_SYNC_NOTIFICATION;
  const payload = { userGold, baseHp, monsterLevel, score, towers, monsters };
  return makeNotification(packetType, payload, user);
};
