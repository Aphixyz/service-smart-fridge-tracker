import { fridgeRepository } from './fridge.repository.ts';
import { appError } from '../../common/error/AppError.ts';
import { Product } from './fridge.type.ts';

const statusMap: Record<string, string> = {
  "Active": "ปกติ",
  "Expired": "หมดอายุ",
  "Expiring": "ใกล้หมดอายุ",
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

  mapProductList(products: Product[]) {
    return products.map((product) => ({
      ...product,
      status: statusMap[product.status] || product.status
    }));
  },


};
