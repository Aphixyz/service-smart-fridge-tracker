import { fridgeRepository } from './fridge.repository.ts';
import { appError } from '../../common/error/AppError.ts';
import { throwIf, catchNotFound } from '../../common/utils/checker.ts';


export interface Fridge {
  id: number;
  quantity: number;
  category: string;
  [key: string]: any;
}

export const fridgeService = {
  findFridgeDetail: async (authId: number) => {
    return await fridgeRepository.FindFridgeDetail(authId)
      .then(catchNotFound(appError.notFound(`Fridge not found`)));
  },
}
