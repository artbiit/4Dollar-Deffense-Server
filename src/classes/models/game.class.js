import IntervalManager from '../managers/interval.manager.js';
import configs from '../../configs/configs.js';
import Monster from './monster.class.js';
import { gamesJoinedbyUsers } from '../../session/sessions.js';
import { getUserById } from '../../session/user.session.js';

// import {
//   createLocationPacket,
//   gameStartNotification,
// } from '../../utils/notification/game.notification.js';

const { GAME_MAX_PLAYER } = configs;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.monsters = {}; // 유저별로 관리되는 몬스터 목록 (각 유저 ID를 키로 사용)
    this.intervalManager = new IntervalManager();
    this.monsterLevel = 1;
    this.state = 'waiting'; // 'waiting', 'inProgress'
    this.towers = {};
  }

  addUser(user) {
    if (this.users.length >= GAME_MAX_PLAYER) {
      throw new Error('Game session is full');
    }

    this.users.push(user);
    this.monsters[user.id] = []; // 새로운 유저 추가 시 몬스터 목록 초기화
    gamesJoinedbyUsers.set(user, this);

    this.towers[user] = [];

    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    if (this.users.length === GAME_MAX_PLAYER) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    delete this.monsters[userId]; // 유저 제거 시 몬스터 목록도 삭제
    this.intervalManager.removePlayer(userId);

    const user = getUserById(userId);
    gamesJoinedbyUsers.delete(user);

    delete this.towers[user];

    if (this.users.length < GAME_MAX_PLAYER) {
      this.state = 'waiting';
    }
  }

  /**
   * 상대방 유저를 조회하는 함수
   * @param {string} userId 기준이 되는 유저의 ID
   * @returns {User} 상대방 유저
   */
  getOpponent(userId) {
    return this.users.filter((user) => user.id !== userId)[0];
  }

  /**
   * 유저가 설치한 타워를 해당 게임의 타워목록에 추가하는 함수
   * @param {User} user 타워를 설치한 유저
   * @param {Tower} tower 설치한 타워
   */
  addTower(user, tower) {
    this.towers[user].push(tower);
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  getTower(userId, towerId) {}
  getMonster(userId, monsterId) {}

  startGame() {}

  getAllLocation() {}

  // 유저의 몬스터 추가
  addMonster(userId, monsterNumber) {
    //생성된 순서대로 번호를 부여하면 서로 겹칠일 없음.
    const monster = new Monster(this.monsters[userId].length + 1, monsterNumber, this.monsterLevel);
    this.monsters[userId].push(monster); // 해당 유저의 몬스터 목록에 몬스터 추가
    //이 유저가아닌 상대 유저한테 noti해야함
    return monster.id;
  }
}

export default Game;
