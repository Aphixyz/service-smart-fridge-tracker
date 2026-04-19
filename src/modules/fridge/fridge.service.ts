import { fridgeRepository } from './fridge.repository.ts';
import { appError } from '../../common/error/AppError.ts';

export interface Fridge {
  id: number;
  quantity: number;
  category: string;
  [key: string]: any;
}

export const fridgeService = {
  findFridgeDetailByHomeId: async (homeId: number) => {
    const fridgeDetails = await fridgeRepository.findFridgeDetailByHomeId(homeId);

    if (fridgeDetails.length === 0) {
      throw appError.notFound('Fridge not found');
    }

    return fridgeDetails;
  },
};
