import { PacketType } from '../../constants/header.js';
import makeNotification from './makeNotification.js';

/**
 * - 상태 동기화 함수
 * @param {number} userGold
 * @param {number} baseHp
 * @param {number} monsterLevel
 * @param {number} score
 * @param {TowerData} towers
 * @param {MonsterData} monsters
 * @returns
 */
export const stateSyncNotification = async (user) => {
  console.log('user: ', user);
  const {
    userId,
    userGold,
    base: { hp: baseHp },
    monsterLevel,
    score,
    towers,
    monsters,
  } = user;

  const packetType = PacketType.STATE_SYNC_NOTIFICATION;
  const payload = { userGold, baseHp, monsterLevel, score, towers, monsters };
  return makeNotification(packetType, payload, userId);
};
