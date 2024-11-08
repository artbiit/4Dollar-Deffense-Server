import { v4 as uuidv4 } from 'uuid';
import { getRandomGameAsset } from '../../utils/asset/getAssets.js';
import { ASSET_TYPE } from '../../constants/assets.js';

class Tower {
  /**
   * @param {{x: Number, y: Number}} coord 설치할 좌표
   */
  constructor(coords) {
    const towerData = getRandomGameAsset(ASSET_TYPE.TOWER);
    this.assetId = towerData.id;
    this.instanceId = uuidv4();

    this.x = coords.x;
    this.y = coords.y;

    this.power = towerData.Power;
  }

  getPower() {
    return this.power;
  }
}
export default Tower;
