import db from '../../common/database/db.ts';

export const fridgeRepository = {
      FindFridgeDetail: async (authId: number) => {
            const sql = `SELECT 
                        hf.id AS fridge_id,
                        hf.name AS fridge_name,
                        hf.location,
                        COUNT(p.id) AS total_items,           -- จำนวนรายการสินค้าทั้งหมดในตู้นั้น
                        SUM(COALESCE(p.quantity, 0)) AS total_quantity, -- ยอดรวมจำนวนสินค้า (เช่น 10.50)
                        COUNT(DISTINCT p.category_id) AS total_categories -- จำนวนประเภทสินค้าที่ไม่ซ้ำกันในตู้นั้น
                        FROM 
                        home_fridge hf
                        LEFT JOIN 
                        products p ON hf.id = p.fridge_id
                        WHERE 
                        hf.home_id = $1  -- specify the home ID you want (e.g., home ID 1)
                        GROUP BY 
                        hf.id, hf.name, hf.location
                        ORDER BY 
                        hf.id ASC;`;
            const res = await db.query(sql, [authId]);
            return res.rows;
      }
}
