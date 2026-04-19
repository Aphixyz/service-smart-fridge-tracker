import db from '../../common/database/db.ts';

export const postRepository = {
  create: async (postData) => {
    const { userId, content, status } = postData;
    const sql = `
      INSERT INTO posts (user_id, content, status)
      VALUES ($1, $2, $3)
      RETURNING id, user_id as "userId", content, status, created_at as "createdAt"
    `;
    const { rows } = await db.query(sql, [userId, content, status]);
    return rows[0];
  },

  findByUserId: async (userId) => {
    const sql = `
      SELECT id, content, status, created_at as "createdAt"
      FROM posts
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const { rows } = await db.query(sql, [userId]);
    return rows;
  },

  delete: async (id) => {
    const sql = `DELETE FROM posts WHERE id = $1`;
    const result = await db.query(sql, [id]);
    return result.rowCount > 0;
  }
};
