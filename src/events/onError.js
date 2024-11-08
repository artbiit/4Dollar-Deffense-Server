import { removeUser } from '../session/user.session.js';

export const onError = (socket) => (err) => {
  console.error('소켓 오류:', err);
  // 세션에서 유저 삭제
  removeUser(socket);
};
