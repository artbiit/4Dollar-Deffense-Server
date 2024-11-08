import logger from '../utils/logger.js';
import configs from '../configs/configs.js';
import { GlobalFailCode } from '../constants/handlerIds.js';
import { findUserById, createUser } from '../db/user/user.db.js';
import { handleError } from '../utils/error/errorHandler.js';
import Result from './result.js';

// 환경 변수에서 설정 불러오기
const { PacketType } = configs;

/***
 * - 회원가입 요청(request) 함수
 *
 * 클라이언트에서 받은 회원가입 정보를 MySQL에 등록해주는 함수.
 *
 * @param {string} param.payload.id - 유저의 ID
 * @param {string} param.payload.password - 유저의 비밀번호
 * @param {string} param.payload.email - 유저의 이메일
 * @returns {void} 별도의 반환 값은 없으며, 성공 여부와 메시지를 클라이언트에게 전송.
 */
export const registerRequestHandler = async ({ payload }) => {
  const { id, password, email } = payload;

  // response data init
  let failCode = GlobalFailCode.NONE;
  let message = undefined;
  let success = true;

  try {
    // 비밀번호 유효성 검사
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*[ㄱ-ㅎ가-힣]).{6,}$/;
    if (!passwordRegex.test(password)) {
      success = false;
      message =
        '비밀번호는 최소 대문자 1개와 특수문자 1개를 포함해야 하며, 한글을 포함할 수 없고, 최소 6자 이상입니다.';
      failCode = GlobalFailCode.AUTHENTICATION_FAILED;
    }

    // 아이디 기반으로 유저 찾기
    const userByDB = await findUserById(id);
    if (userByDB) {
      success = false;
      message = '이미 존재하는 유저입니다.';
      failCode = GlobalFailCode.AUTHENTICATION_FAILED;
    }

    // 회원가입
    const [newUser] = await createUser(id, password, email);
    message = '회원가입을 완료했습니다.';
    logger.info(`회원가입 완료: ${newUser.insertId}`);
  } catch (error) {
    success = false;
    message = '회원가입 과정 중 문제가 발생했습니다..';
    failCode = GlobalFailCode.AUTHENTICATION_FAILED;
    handleError(PacketType.REGISTER_REQUEST, error);
  }

  return new Result({ success, message, failCode }, PacketType.REGISTER_RESPONSE);
};
