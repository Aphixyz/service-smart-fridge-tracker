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

   FindProductsByFridgeId: async (fridgeId: number) => {
            const sql = `SELECT 
                              pd.id, pd."name" AS products_name,
                              pd.category_id ,
                              cat.name AS categories_name, 
                              pd.quantity ,pd.unit ,pd.expiry_date, pd.status, cat.icon 
                        FROM products pd 
                              JOIN home_fridge hf ON pd.fridge_id = hf.id 
                              JOIN categories cat ON pd.category_id = cat.id 
                        WHERE hf.id = $1`;
            const res = await db.query(sql, [fridgeId]);
            return res.rows;
      },
    
    deleteProduct: async (fridgeId: number, productId: number) => {
        const sql = `DELETE FROM products WHERE fridge_id = $1 AND id = $2`;
        const res = await db.query(sql, [fridgeId, productId]);
        return res.rowCount;
    }
};

