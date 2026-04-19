import db from "../../common/database/db.ts";

export const registerRepository = {
  findExistUsername: async (username: string) => {
    const sql = `SELECT username FROM home_user WHERE username = $1 LIMIT 1`;
    const { rows } = await db.query(sql, [username]);
    return rows[0];
  },

  createUser: async (data: {
    name: string;
    username: string;
    password: string;
  }) => {
    const sql = `
    INSERT INTO home_user (
      name,
      username,
      password,
    )
    VALUES ($1, $2, $3)
    RETURNING *
  `;

    const values = [data.name, data.username, data.password];

    const { rows } = await db.query(sql, values);
    return rows[0] ?? null;
  },
};
