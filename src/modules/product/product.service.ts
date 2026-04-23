import { appError } from "../../common/error/AppError.ts";
import { productRepository } from "./product.repository.ts";
import type {
    Product,
    UpdateProductInput,
} from "./product.type.ts";

export const productService = {
    async findById(id: number): Promise<Product> {
        const item = await productRepository.findById(id);
        if (!item) {
            throw appError.notFound("ไม่พบของในตู้เย็น");
        }
        return item;
    },

    async updateProcut(id: number, data: UpdateProductInput): Promise<Product> {
        const item = await productRepository.updateProduct(id, data);
        if (!item) {
            throw appError.notFound("ไม่พบของในตู้เย็น");
        }
        return item;
    },

};
