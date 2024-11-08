import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import configs from '../configs/configs.js';
import { GlobalFailCode } from '../constants/handlerIds.js';
import { cacheUserToken, findUserByIdPw } from '../db/user/user.db.js';
import { handleError } from '../utils/error/errorHandler.js';
import Result from './result.js';
import { addUser } from '../session/user.session.js';

// 환경 변수에서 설정 불러오기
const { JWT_SECRET, JWT_EXPIRES_IN, JWT_ALGORITHM, JWT_ISSUER, JWT_AUDIENCE, PacketType } = configs;

/***
 * - 로그인 요청(request) 함수
 *
 * 클라이언트에서 받은 로그인 정보를 통해 사용자를 인증(대소문자 구분)하고, 성공 시 JWT 토큰을 발급해주는 함수.
 *
 * @param {string} param.payload.id - 유저의 ID
 * @param {string} param.payload.password - 유저의 비밀번호
 * @returns {void} 별도의 반환 값은 없으며, 성공 여부와 메시지를 클라이언트에게 전송.
 */
export const loginRequestHandler = async ({ socket, payload }) => {
  const { id, password } = payload;

  // response data init
  let success = true;
  let message = undefined;
  let token = '';
  let failCode = GlobalFailCode.NONE;

  try {
    // 아이디와 비밀번호 기반으로 유저 찾기
    const userByDB = await findUserByIdPw(id, password);
    if (userByDB) {
      // 토큰 생성
      token = jwt.sign({ userId: id, seqNo: userByDB.seqNo }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: JWT_ALGORITHM,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });

      // 토큰 캐싱
      await addUser(socket, userByDB, token);

      // 성공 메시지
      message = '로그인에 성공 했습니다.';
      logger.info(`로그인 성공 : ${userByDB.seqNo}`);
    } else {
      // 비밀번호가 틀렸을 경우
      success = false;
      message = '아이디 혹은 비밀번호를 확인해주세요.';
      failCode = GlobalFailCode.AUTHENTICATION_FAILED;
    }
  } catch (error) {
    success = false;
    message = '로그인 과정 중 문제가 발생했습니다.';
    failCode = GlobalFailCode.UNKNOWN_ERROR;
    handleError(PacketType.LOGIN_REQUEST, error);
  }

  return new Result({ success, message, token, failCode }, PacketType.LOGIN_RESPONSE);
};
