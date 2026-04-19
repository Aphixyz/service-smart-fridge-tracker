import db from '../../common/database/db.ts';

export const userRepository = {
  findMany: async ({ start, limit }: { start: number; limit: number }) => {
    const sql = `
      SELECT id, name, email, role, created_at as "createdAt"
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const countSql = `SELECT COUNT(*) FROM users`;

    const [dataRes, countRes] = await Promise.all([
      db.query(sql, [limit, start]),
      db.query(countSql)
    ]);

    return { 
      data: dataRes.rows, 
      total: parseInt(countRes.rows[0].count) 
    };
  },

  findOneById: async (id: number) => {
    const sql = `SELECT * FROM users WHERE id = $1 LIMIT 1`;
    const { rows } = await db.query(sql, [id]);
    return rows[0];
  },

  findOneByEmail: async (email: string) => {
    const sql = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
    const { rows } = await db.query(sql, [email]);
    return rows[0];
  },

  create: async (userData: any) => {
    const { name, email, password, role } = userData;
    const sql = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at as "createdAt"
    `;
    const { rows } = await db.query(sql, [name, email, password, role]);
    return rows[0];
  },

  update: async (id: number, updateData: any) => {
    const { name, email } = updateData;
    const sql = `
      UPDATE users 
      SET name = COALESCE($1, name), 
          email = COALESCE($2, email),
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    const { rows } = await db.query(sql, [name, email, id]);
    return rows[0];
  },

  delete: async (id: number) => {
    const sql = `DELETE FROM users WHERE id = $1`;
    const result = await db.query(sql, [id]);
    return (result.rowCount || 0) > 0;
  }
};
