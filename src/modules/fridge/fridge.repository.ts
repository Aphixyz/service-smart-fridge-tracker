import db from '../../common/database/db.ts';

export const fridgeRepository = {
  findFridgeDetailByHomeId: async (homeId: number) => {
    const sql = `
      SELECT
        hf.id AS fridge_id,
        hf.name AS fridge_name,
        hf.location,
        COUNT(p.id) AS total_items,
        SUM(COALESCE(p.quantity, 0)) AS total_quantity,
        COUNT(DISTINCT p.category_id) AS total_categories
      FROM home_fridge hf
      LEFT JOIN products p ON hf.id = p.fridge_id
      WHERE hf.home_id = $1
      GROUP BY hf.id, hf.name, hf.location
      ORDER BY hf.id ASC;
    `;

    const result = await db.query(sql, [homeId]);
    return result.rows;
  },
};
