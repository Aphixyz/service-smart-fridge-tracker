import db from "../../common/database/db.ts";
import type {
  Categoires,
  CreateCategoiresInput,
  UpdateCategoiresInput,
} from "./categoires.type.ts";

export const categoiresRepository = {
  findAll: async (): Promise<Categoires[]> => {
    const sql = `
      SELECT *
      FROM categories
      ORDER BY id ASC;
    `;

    const { rows } = await db.query<Categoires>(sql);
    return rows;
  },

  findById: async (id: number): Promise<Categoires | null> => {
    const sql = `
      SELECT *
      FROM categories
      WHERE id = $1
      LIMIT 1;
    `;

    const { rows } = await db.query<Categoires>(sql, [id]);
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
