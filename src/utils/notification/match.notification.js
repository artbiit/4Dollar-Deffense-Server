import { getGameAsset } from '../asset/getAssets.js';
import configs from '../../configs/configs.js';
import logger from '../logger.js';
import { createResponse } from '../response/createResponse.js';
const { PacketType, ASSET_TYPE } = configs;
/**
 * message S2CMatchStartNotification {
    InitialGameState initialGameState = 1;
    GameState playerData = 2;
    GameState opponentData = 3;
}
    
message InitialGameState {
  int32 baseHp = 1;
  int32 towerCost = 2;
  int32 initialGold = 3;
  int32 monsterSpawnInterval = 4;
}

message GameState {
  int32 gold = 1;
  BaseData base = 2;
  int32 highScore = 3;
  repeated TowerData towers = 4;
  repeated MonsterData monsters = 5;
  int32 monsterLevel = 6;
  int32 score = 7;
  repeated Position monsterPath = 8;
  Position basePosition = 9;
}
  
message BaseData {
  int32 hp = 1;
  int32 maxHp = 2;
}
 * 
 */
export const matchSuccessNotification = async (gameSession) => {
  let gameUser = null;
  try {
    const users = gameSession.users;

    const bases = getGameAsset(ASSET_TYPE.BASE);
    const towers = getGameAsset(ASSET_TYPE.TOWER);
    const initialGameState = {
      baseHp: bases.data[0].maxHp,
      towerCost: towers.data[0].Cost,
      initialGold: 0,
      monsterSpawnInterval: gameSession.monsterSpawnInterval,
    };

    const keys = Object.keys(users);

    for (let i = 0; i <= users.length; i++) {
      if (keys[i] == 'length') {
        continue;
      }
      gameUser = users[keys[i]];
      const user = gameUser.user;
      const socket = user.socket;
      const playerData = gameSession.getPlayerData(user.id);

      const opponent = gameSession.getOpponent(user.id);
      const opponentData = gameSession.getPlayerData(opponent.user.id);

      const buffer = createResponse(PacketType.MATCH_START_NOTIFICATION, user, {
        initialGameState,
        playerData,
        opponentData,
      });
      socket.write(buffer);
    }
  } catch (error) {
    let userData = gameUser ? JSON.stringify(gameUser) : '';
    logger.error(`matchSuccessNotification. failed notification : ${error} : ${userData}`);
  }
};
