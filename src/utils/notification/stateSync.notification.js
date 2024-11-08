import logger from '../utils/logger.js';

// int32 userGold = 1;
export const stateSyncUserGold = async (userGold, user) => {
  const packetType = PacketType.STATE_SYNC_NOTIFICATION;
  return makeNotification(packetType, payload, user);
};

// int32 baseHp = 2;
export const stateSyncBaseHp = async (baseHp, user) => {
  const packetType = PacketType.STATE_SYNC_NOTIFICATION;
  return makeNotification(packetType, payload, user);
};

// int32 monsterLevel = 3;
export const stateSyncMonsterLevel = async (monsterLevel, user) => {
  const packetType = PacketType.STATE_SYNC_NOTIFICATION;
  return makeNotification(packetType, payload, user);
};

// int32 score = 4;
export const stateSyncScore = async (score, user) => {
  const packetType = PacketType.STATE_SYNC_NOTIFICATION;
  return makeNotification(packetType, payload, user);
};

// repeated TowerData towers = 5;
export const stateSyncTowers = async (towers, user) => {
  const packetType = PacketType.STATE_SYNC_NOTIFICATION;
  return makeNotification(packetType, payload, user);
};

// repeated MonsterData monsters = 6;
export const stateSyncMonsters = async (monsters, user) => {
  const packetType = PacketType.STATE_SYNC_NOTIFICATION;
  return makeNotification(packetType, payload, user);
};
