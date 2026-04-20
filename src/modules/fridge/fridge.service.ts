import { fridgeRepository } from './fridge.repository.ts';
import { appError } from '../../common/error/AppError.ts';

export interface Fridge {
  id: number;
  quantity: number;
  category: string;
  [key: string]: any;
}

export interface Product {
  id: number;
  name: string;
  category_id: number;
  categories_name: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  status: string;
  [key: string]: any;
}
const statusMap: Record<string, string> = {
  "Active": "ปกติ",         // หรือจะใช้คำว่า "พร้อมทาน", "ใช้งานอยู่"
  "Expired": "หมดอายุ",
  "Expiring": "ใกล้หมดอายุ", // ถ้ามี
  "Consumed": "หมดแล้ว"     // ถ้ามี
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
