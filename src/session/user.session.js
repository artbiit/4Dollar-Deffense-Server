import User from '../classes/models/user.class.js';
import logger from '../utils/logger.js';
import game from '../classes/models/game.class.js';
import { gamesJoinedbyUsers } from './sessions.js';
import { cacheUserToken, unlinkUserToken } from '../db/user/user.db.js';
import { removeUsers } from '../db/match/match.redis.js';

export const userSessions = [];

export const addUser = async (socket, userByDB, token) => {
  const uuid = Number(userByDB.seqNo);

  await cacheUserToken(uuid, token);
  const user = new User(uuid, socket, userByDB.bestScore);
  userSessions.push(user);
  gamesJoinedbyUsers.set(user, undefined);
  return userByDB;
};

export const removeUser = async (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);

  if (index !== -1) {
    const user = getUserBySocket(socket);
    gamesJoinedbyUsers.delete(user);
    unlinkUserToken(user.id);
    removeUsers(user.id);
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.id == id);
};

export const getUserByDeviceId = (deviceId) => {
  return userSessions.find((user) => user.deviceId === deviceId);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
