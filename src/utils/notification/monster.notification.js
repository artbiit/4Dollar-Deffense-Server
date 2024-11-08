import { PacketType } from '../../constants/header.js';
import makeNotification from './makeNotification.js';
// S2CSpawnEnemyMonsterNotification 패킷 생성 함수
export const monsterSpawnNotification = (monsterId, monsterNumber, user) => {
  const packetType = PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION;
  const payload = { monsterId, monsterNumber };
  return makeNotification(packetType, payload, user);
};
