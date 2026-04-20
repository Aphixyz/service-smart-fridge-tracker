import db from "../../common/database/db.ts";
import type {
  Categoires,
  CreateCategoiresInput,
  UpdateCategoiresInput,
} from "./categoires.type.ts";

export const categoiresRepository = {
  findAll: async (id: number): Promise<Categoires[]> => {
    const sql = `
      SELECT cat.id, cat.name, cat.icon
      FROM categories cat LEFT JOIN home_user hu ON cat.home_id = hu."id"
      WHERE hu."id" = $1 OR hu."id" IS NULL
      ORDER BY id ASC;
    `;
    const { rows } = await db.query<Categoires>(sql, [id]);
    return rows;
  },

  findById: async (
    id: number,
    homeId: number,
  ): Promise<Categoires | null> => {
    const sql = `
      SELECT id, home_id, name, icon
      FROM categories
      WHERE id = $1
        AND (home_id = $2 OR home_id IS NULL)
      LIMIT 1;
    `;
    const { rows } = await db.query<Categoires>(sql, [id, homeId]);
    return rows[0] ?? null;
  },

  create: async (data: CreateCategoiresInput): Promise<Categoires | null> => {
    const sql = `
      INSERT INTO categories (home_id, name, icon)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [data.home_id ?? null, data.name, data.icon];
    const { rows } = await db.query<Categoires>(sql, values);

    return rows[0] ?? null;
  },

  update: async (
    id: number,
    data: UpdateCategoiresInput,
  ): Promise<Categoires | null> => {
    const sql = `
      UPDATE categories
      SET home_id = $1, name = $2, icon = $3
      WHERE id = $4
      RETURNING *;
    `;

    const values = [data.home_id ?? null, data.name, data.icon, id];
    const { rows } = await db.query<Categoires>(sql, values);

    return rows[0] ?? null;
  },

  remove: async (id: number): Promise<Categoires | null> => {
    const sql = `
      DELETE FROM categories
      WHERE id = $1
      RETURNING *;
    `;

    const { rows } = await db.query<Categoires>(sql, [id]);
    return rows[0] ?? null;
  },
};
