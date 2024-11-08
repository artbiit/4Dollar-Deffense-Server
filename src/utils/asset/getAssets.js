import { ASSET_TYPE } from '../../constants/assets.js';
import { gameAssets } from '../../init/loadAssets.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

/**
 * 로드한 게임에셋 전체를 조회하는 함수
 * @returns {{base: {}, monsters: {}, towers: {}}} JSON화된 모든 게임에셋
 */
export const getAllGameAssets = () => {
  return gameAssets;
};

/**
 * 특정 게임에셋을 조회하는 함수
 *
 * 호출 예시: const monsters = getGameAsset(ASSET_TYPE.MONSTER);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @returns {{name: string, version: string, data: {}}}} JSON화된 게임에셋
 */
export const getGameAsset = (assetType) => {
  const { base, monsters, towers } = getAllGameAssets();

  switch (assetType) {
    case ASSET_TYPE.BASE:
      return base;
    case ASSET_TYPE.MONSTER:
      return monsters;
    case ASSET_TYPE.TOWER:
      return towers;
    default:
      throw CustomError(ErrorCodes.INVALID_ASSET, '올바르지 않은 게임에셋 타입입니다:', assetType);
  }
};

/**
 * 게임에셋의 특정 데이터를 id로 조회하는 함수
 *
 * Base의 경우 단일 데이터이므로 id값을 넣치 않아도 데이터를 반환
 *
 * 호출 예시: const towerData = getGameAssetById(ASSET_TYPE.TOWER, "TOW00001");
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @param {string} id 조회할 항목의 id
 * @returns {JSON} 해당 id의 데이터 ( 예시: { id: "TOW00001", DisplayName: "일반타워", Description: "평범한 타워", ... } )
 */
export const getGameAssetById = (assetType, id = '') => {
  const { base, monsters, towers } = getAllGameAssets();

  switch (assetType) {
    case ASSET_TYPE.BASE: // BASE: 단일 테이터이므로 유일한 데이터를 반환
      return base.data[0];
    case ASSET_TYPE.MONSTER:
      return monsters.data.find((monster) => monster.id === id);
    case ASSET_TYPE.TOWER:
      return towers.data.find((tower) => tower.id === id);
    default:
      throw CustomError(ErrorCodes.INVALID_ASSET, '올바르지 않은 게임에셋 타입입니다:', assetType);
  }
};

/**
 * 특정 게임에셋의 랜덤한 항목을 조회하는 함수
 *
 * 호출 예시: const towerData = getRandomGameAsset(ASSET_TYPE.TOWER);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @returns {JSON} 해당 id의 데이터 ( 예시: { id: "MON00002", DisplayName: "흰눈애벌레", Description: "약한 벌레", ... } )
 */
export const getRandomGameAsset = (assetType) => {
  const numItems = getGameAsset(assetType).length;
  const randomId = Math.floor(Math.random() * numItems);
  return getGameAssetById(assetType, randomId);
};
