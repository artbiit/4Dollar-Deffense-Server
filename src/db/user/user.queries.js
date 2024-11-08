export const SQL_QUERIES = {
  FIND_USER_BY_ID: 'SELECT * FROM accounts WHERE id = ?',
  FIND_USER_BY_ID_PW: 'SELECT * FROM accounts WHERE id = ? AND password = ?',
  INSERT_USER: `INSERT INTO accounts (id, password, email, best_score, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)`,
};
