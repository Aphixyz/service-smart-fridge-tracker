import { fridgeRepository } from './fridge.repository.ts';
import { appError } from '../../common/error/AppError.ts';
import { Product, RequestFridgeProduct } from './fridge.type.ts';

const statusMap: Record<string, string> = {
  "Active": "ควรบริโภค",
  "Expired": "ไม่ควรบริโภค",
  "Consumed": "หมดแล้ว"
};

export const fridgeService = {

  async findFridgeDetailByHomeId(homeId: number) {
    const fridgeDetails = await fridgeRepository.findFridgeDetailByHomeId(homeId);
    if (fridgeDetails.length === 0) {
      throw appError.notFound('Fridge not found');
    }
    return fridgeDetails;
  },

  async findProductsByFridgeId(fridgeId: number) {
    const products = await fridgeRepository.FindProductsByFridgeId(fridgeId);
    if (products.length === 0) {
      throw appError.notFound('Products not found');
    }
    return this.mapProductList(products);
  },

  async deleteProduct(fridgeId: number, productId: number) {
    const deletedCount = await fridgeRepository.deleteProduct(fridgeId, productId);
    if (deletedCount === 0) {
      throw appError.notFound('ไม่พบสินค้าในตู้เย็น');
    }
    return { message: 'ลบสินค้าออกจากตู้เย็นเรียบร้อย' };
  },

  mapProductList(products: Product[]) {
    return products.map((product) => ({
      ...product,
      status: statusMap[product.status] || product.status
    }));
  },

  async insertProduct(fridgeId: number, product: RequestFridgeProduct) {
    const result = await fridgeRepository.insertProduct(fridgeId, product);
    return result;
  },

};
