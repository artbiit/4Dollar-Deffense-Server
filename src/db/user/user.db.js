import { mysql } from '../mysql.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase, timeConversion, timeFormatting } from '../utils.js';
import { getRedis } from '../redis.js';
import configs from '../../configs/configs.js';
const { JWT_EXPIRES_IN } = configs;

export const findUserById = async (userId) => {
  const [rows] = await mysql.query(SQL_QUERIES.FIND_USER_BY_ID, [userId]);
  return toCamelCase(rows[0]);
};

export const findUserByIdPw = async (userId, password) => {
  const [rows] = await mysql.query(SQL_QUERIES.FIND_USER_BY_ID_PW, [userId, password]);
  return toCamelCase(rows[0]);
};

export const createUser = async (id, password, email) => {
  const bestScore = 0;
  const created_at = timeFormatting(new Date());
  const updated_at = timeFormatting(new Date());
  return await mysql.execute(SQL_QUERIES.INSERT_USER, [
    id,
    password,
    email,
    bestScore,
    created_at,
    updated_at,
  ]);
};

export const cacheUserToken = async (seqNo, token) => {
  const redis = await getRedis();
  return await redis.set(
    `user:${seqNo}:accessToken`,
    token,
    'EX',
    timeConversion(JWT_EXPIRES_IN) + 60,
  );
};

export const unlinkUserToken = async (seqNo) => {
  const redis = await getRedis();
  return await redis.unlink(`user:${seqNo}:accessToken`);
};
