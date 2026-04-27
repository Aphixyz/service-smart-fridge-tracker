import db from "../../common/database/db.ts";
import type { Profile } from "./profile.type.ts";

export const profileRepository = {
  async findOneByUserId(userId: number): Promise<Profile | null> {
    const sql = `
      SELECT id, name, username, setting_id, profile_image
      FROM home_user
      WHERE id = $1
      LIMIT 1
    `;

    const { rows } = await db.query<Profile>(sql, [userId]);
    return rows[0] ?? null;
  },
};
