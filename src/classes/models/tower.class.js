import { getRandomGameAsset } from '../../utils/asset/getAssets.js';
import { ASSET_TYPE } from '../../constants/assets.js';

class Tower {
  /**
   * @param {number} instanceId 타워를 구분하기 위한 개체 ID
   * @param {{x: Number, y: Number}} coords 설치할 좌표
   */
  constructor(instanceId, coords) {
    const towerData = getRandomGameAsset(ASSET_TYPE.TOWER);
    this.assetId = towerData.id;
    this.instanceId = instanceId;

    this.x = coords.x;
    this.y = coords.y;

    this.power = towerData.Power;
  }

  getPower() {
    return this.power;
  }
}
export default Tower;
