import logger from '../utils/logger.js';
import { gameSessions, gamesJoinedbyUsers } from './sessions.js';
import Game from '../classes/models/game.class.js';
import { getUserById, getUserBySocket } from './user.session.js';
import { v4 as uuidv4 } from 'uuid';
import { cacheGameSession, unlinkGameSession } from '../db/game/game.redis.js';

export const addGameSession = async () => {
  const session = new Game(uuidv4());
  gameSessions.push(session);
  await cacheGameSession(session.id);
  return session;
};

export const removeGameSession = (id) => {
  const index = gameSessions.findIndex((session) => session.id === id);
  if (index !== -1) {
    unlinkGameSession(id);
    return gameSessions.splice(index, 1)[0];
  }
};

export const getGameSession = (id) => {
  return gameSessions.find((session) => session.id === id);
};

export const addMonsterToGameSession = (socket, monsterNumber) => {
  const session = getGameSessionBySocket(socket);
  const user = getUserBySocket(socket);
  if (session && user) {
    return session.addMonster(user.id, monsterNumber);
  }

  logger.error(
    `addMonsterToGameSession. failed add Monster : [${session.id}][${user.id}] => ${monsterNumber}`,
  );
  return null;
};

/**
 * @param {User} user
 * @returns {Game} gameSession
 */
export const getGameSessionByUser = (user) => {
  return gamesJoinedbyUsers.get(user);
};

/**
 * @param {string} userId
 * @returns {Game} gameSession
 */
export const getGameSessionByUserId = (userId) => {
  const user = getUserById(userId);
  return gamesJoinedbyUsers.get(user);
};

/**
 * @param {net.Socket} socket
 * @returns {Game} gameSession
 */
export const getGameSessionBySocket = (socket) => {
  const user = getUserBySocket(socket);
  return gamesJoinedbyUsers.get(user);
};

export const getAllGameSessions = () => {
  return gameSessions;
};
