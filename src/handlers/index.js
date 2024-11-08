import configs from '../configs/configs.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { registerRequestHandler } from './register.handler.js';
import { loginRequestHandler } from './login.handler.js';
import {
  monsterAttackBaseRequestHandler,
  towerAttackRequestHandler,
} from './attack/attack.handler.js';
import { matchRequestHandler } from './matchRequest.handler.js';
import towerPurchaseHandler from './tower/towerPurchase.handler.js';
import { spawnMonsterRequestHandler } from './monster/monsterSpawn.handler.js';
import monsterDeathHandler from './monster/monsterDeath.handler.js';

const { PacketType } = configs;

const handlers = {
  [PacketType.REGISTER_REQUEST]: {
    handler: registerRequestHandler,
    protoType: 'C2SRegisterRequest',
    fieldName: 'registerRequest',
  },
  [PacketType.REGISTER_RESPONSE]: {
    handler: undefined,
    protoType: 'S2CRegisterResponse',
    fieldName: 'registerResponse',
  },
  [PacketType.LOGIN_REQUEST]: {
    handler: loginRequestHandler,
    protoType: 'C2SLoginRequest',
    fieldName: 'loginRequest',
  },
  [PacketType.LOGIN_RESPONSE]: {
    handler: undefined,
    protoType: 'S2CLoginResponse',
    fieldName: 'loginResponse',
  },
  [PacketType.MATCH_REQUEST]: {
    handler: matchRequestHandler,
    protoType: 'C2SMatchRequest',
    fieldName: 'matchRequest',
  },
  [PacketType.MATCH_START_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CMatchStartNotification',
    fieldName: 'matchStartNotification',
  },
  [PacketType.STATE_SYNC_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CStateSyncNotification',
    fieldName: 'stateSyncNotification',
  },
  [PacketType.TOWER_PURCHASE_REQUEST]: {
    handler: towerPurchaseHandler,
    protoType: 'C2STowerPurchaseRequest',
    fieldName: 'towerPurchaseRequest',
  },
  [PacketType.TOWER_PURCHASE_RESPONSE]: {
    handler: undefined,
    protoType: 'S2CTowerPurchaseResponse',
    fieldName: 'towerPurchaseResponse',
  },
  [PacketType.ADD_ENEMY_TOWER_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CAddEnemyTowerNotification',
    fieldName: 'addEnemyTowerNotification',
  },
  [PacketType.SPAWN_MONSTER_REQUEST]: {
    handler: spawnMonsterRequestHandler,
    protoType: 'C2SSpawnMonsterRequest',
    fieldName: 'spawnMonsterRequest',
  },
  [PacketType.SPAWN_MONSTER_RESPONSE]: {
    handler: undefined,
    protoType: 'S2CSpawnMonsterResponse',
    fieldName: 'spawnMonsterResponse',
  },
  [PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CSpawnEnemyMonsterNotification',
    fieldName: 'spawnEnemyMonsterNotification',
  },
  [PacketType.TOWER_ATTACK_REQUEST]: {
    handler: towerAttackRequestHandler,
    protoType: 'C2STowerAttackRequest',
    fieldName: 'towerAttackRequest',
  },
  [PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CEnemyTowerAttackNotification',
    fieldName: 'enemyTowerAttackNotification',
  },
  [PacketType.MONSTER_ATTACK_BASE_REQUEST]: {
    handler: monsterAttackBaseRequestHandler,
    protoType: 'C2SMonsterAttackBaseRequest',
    fieldName: 'monsterAttackBaseRequest',
  },
  [PacketType.UPDATE_BASE_HP_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CUpdateBaseHPNotification',
    fieldName: 'updateBaseHpNotification',
  },
  [PacketType.GAME_OVER_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CGameOverNotification',
    fieldName: 'gameOverNotification',
  },
  [PacketType.GAME_END_REQUEST]: {
    handler: undefined,
    protoType: 'C2SGameEndRequest',
    fieldName: 'gameEndRequest',
  },
  [PacketType.MONSTER_DEATH_NOTIFICATION]: {
    handler: monsterDeathHandler,
    protoType: 'C2SMonsterDeathNotification',
    fieldName: 'monsterDeathNotification',
  },
  [PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION]: {
    handler: undefined,
    protoType: 'S2CEnemyMonsterDeathNotification',
    fieldName: 'enemyMonsterDeathNotification',
  },
};
export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].protoType;
};

export const getFieldNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].fieldName;
};
