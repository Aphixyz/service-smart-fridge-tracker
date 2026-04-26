import { fridgeRepository } from './fridge.repository.ts';
import { appError } from '../../common/error/AppError.ts';
import { Product, RequestFridgeProduct, FridgeBody } from './fridge.type.ts';

const statusMap: Record<string, string> = {
  "Active": "ควรบริโภค",
  "Expired": "ไม่ควรบริโภค",
  "Consumed": "หมดแล้ว"
};

export const fridgeService = {

  async findFridgeDetailByHomeId(homeId: number) {
    const fridgeDetails = await fridgeRepository.findFridgeDetailByHomeId(homeId);
    if (fridgeDetails.length === 0) {
      return [];
    }
    return fridgeDetails;
  },

  async findProductsByFridgeId(fridgeId: number) {
    const products = await fridgeRepository.FindProductsByFridgeId(fridgeId);
    if (products.length === 0) {
      return [];
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

  async insertFridge(homeId: number, fridge: FridgeBody) {
    const result = await fridgeRepository.insertFridge(homeId, fridge);
    return result;
  },

};
