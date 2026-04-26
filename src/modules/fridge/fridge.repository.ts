import db from '../../common/database/db.ts';
import { RequestFridgeProduct, FridgeBody } from './fridge.type.ts';

export const fridgeRepository = {
  findFridgeDetailByHomeId: async (homeId: number) => {
    const sql = `
      SELECT
        hf.id AS fridge_id,
        hf.name AS fridge_name,
        hf.location,
        COUNT(p.id) AS total_items,
        SUM(COALESCE(p.quantity, 0)) AS total_quantity,
        COUNT(DISTINCT p.category_id) AS total_categories,
        COUNT(CASE WHEN p.status != 'Active' THEN 1 END) AS inactive_items_count
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
                        WHERE hf.id = $1
                        ORDER BY pd.id ASC`;
    const res = await db.query(sql, [fridgeId]);
    return res.rows;
  },

  deleteProduct: async (fridgeId: number, productId: number) => {
    const sql = `DELETE FROM products WHERE fridge_id = $1 AND id = $2`;
    const res = await db.query(sql, [fridgeId, productId]);
    return res.rowCount;
  },

  insertProduct: async (
    fridgeId: number,
    product: RequestFridgeProduct
  ) => {
    const sql = `
        INSERT INTO products (fridge_id, category_id, name, expiry_date, quantity, unit, status) 
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    
    const values = [fridgeId, product.body.category_id, product.body.name, product.body.expiry_date, product.body.quantity, product.body.unit, product.body.status='Active'];
    const res = await db.query(sql, values);
    return res.rows[0]; 
  },

  insertFridge: async (homeId: number, fridge: FridgeBody) => {
    const sql = `
        INSERT INTO home_fridge (home_id, name, location) 
        VALUES($1, $2, $3)
        RETURNING *;
    `;
    
    const values = [homeId, fridge.name, fridge.location];
    const res = await db.query(sql, values);
    return res.rows[0]; 
  }

};

