import { getGameAsset } from '../../utils/asset/getAssets.js';
import configs from '../../configs/configs.js';
import logger from '../../utils/logger.js';

const { ASSET_TYPE } = configs;
class Monster {
  constructor(id, monsterNumber, level = 1) {
    this.id = id;

    const monsterId = `MON${String(monsterNumber).padStart(5, '0')}`;
    const monsters = getGameAsset(ASSET_TYPE.MONSTER);
    const monsterData = monsters.data.find((monster) => monster.id === monsterId);
    if (!monsterData) throw new Error(`${monsterId}라는 몬스터가 존재하지 않습니다.`);

    this.monsterId = monsterId;
    this.monsterNumber = monsterNumber;
    // JSON 데이터에서 몬스터의 기본 속성 초기화

    this.displayName = monsterData.DisplayName;
    this.description = monsterData.Description;
    this.level = level;

    // JSON 데이터의 레벨별 증가량을 기반으로 속성 계산
    this.hp = this.calculateHp(monsterData);
    this.attack = this.calculateAttack(monsterData);
    this.defense = this.calculateDefense(monsterData);
    this.speed = monsterData.spd;
    this.isAlive = true; // 몬스터가 생성될 때 살아있는 상태로 초기화
  }

  // 레벨에 따른 체력 계산
  calculateHp(monsterData) {
    return monsterData.maxHp + monsterData.HpPerLv * (this.level - 1);
  }

  // 레벨에 따른 공격력 계산
  calculateAttack(monsterData) {
    return monsterData.Atk + monsterData.AtkPerLv * (this.level - 1);
  }

  // 레벨에 따른 방어력 계산
  calculateDefense(monsterData) {
    return monsterData.def + monsterData.DefPerLv * (this.level - 1);
  }

  // 데미지 받음
  takeDamage(towerPower) {
    // 받은 데미지 값에서 몬스터의 방어력을 빼서 실제 피해량 계산(0이하로 떨어지면 사망)
    const actualDamage = Math.max(0, towerPower - this.defense);
    this.hp -= actualDamage;

    logger.info(`몬스터가 ${actualDamage} 만큼의 피해를 입었습니다.`);

    // 몬스터 체력이 0이하로 떨어지면 사망
    if (this.hp <= 0) {
      this.hp = 0;
      this.isAlive = false;
    }
  }

  // 몬스터 정보 출력 (디버깅이나 상태 확인용)
  getInfo() {
    return {
      id: this.id,
      name: this.displayName,
      description: this.description,
      level: this.level,
      hp: this.hp,
      attack: this.attack,
      defense: this.defense,
      speed: this.speed,
      isAlive: this.isAlive,
    };
  }
  /* // 예시: 레벨 3의 "MON00001" 몬스터 생성
const monster = new Monster("MON00001", 3);
console.log(monster.getInfo()); */
}

export default Monster;
