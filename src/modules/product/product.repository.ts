import db from "../../common/database/db.ts";
import type {
    Product,
    UpdateProductInput
} from "./product.type.ts";

export const productRepository = {


    findById: async (id: number): Promise<Product | null> => {
        const sql = `
            SELECT
                products."id", 
                products.category_id, 
                products.fridge_id, 
                products."name", 
                products.expiry_date, 
                products.quantity, 
                products.unit
            FROM
                products
            WHERE
                "id" = $1
            LIMIT 1;
        `;

        const { rows } = await db.query<Product>(sql, [id]);
        return rows[0] ?? null;
    },

    updateProduct: async (id: number, data: UpdateProductInput): Promise<Product | null> => {
        const sql = `
        UPDATE products
        SET 
            "name" = COALESCE($2, "name"),
            category_id = COALESCE($3, category_id),
            quantity = COALESCE($4, quantity),
            unit = COALESCE($5, unit),
            expiry_date = COALESCE($6, expiry_date)
        WHERE 
            id = $1
        RETURNING *; 
    `;

        const values = [
            id,
            data.name,
            data.category_id,
            data.quantity,
            data.unit,
            data.expiry_date
        ];

        const { rows } = await db.query<Product>(sql, values);
        return rows[0] ?? null;
    },




};
