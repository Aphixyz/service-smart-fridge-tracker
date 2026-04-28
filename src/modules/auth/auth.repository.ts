import db from "../../common/database/db.ts";
import type { AuthUserRecord } from "./auth.type.ts";

export const authRepository = {
  findOneByUsername: async (
    username: string,
  ): Promise<AuthUserRecord | null> => {
    const sql = `
      SELECT id, name, username, password
      FROM home_user
      WHERE username = $1
      LIMIT 1
    `;

    const { rows } = await db.query<AuthUserRecord>(sql, [username]);
    return rows[0] || null;
  },

  updatePassword: async (id: number, password: string): Promise<void> => {
    const sql = `
      UPDATE home_user
      SET password = $2
      WHERE id = $1
    `;
    await db.query<AuthUserRecord>(sql, [id, password]);
  },



};
