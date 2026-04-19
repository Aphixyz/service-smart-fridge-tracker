import { Router } from 'express';
import { apiResponse } from '../../common/response/ApiResponse.ts';
import { authMiddleware } from '../../common/middleware/auth.middleware.ts';
import { catchAsync } from '../../common/utils/catchAsync.ts';
import { fridgeService } from './fridge.service.ts';

export const fridgeRouter = Router();

fridgeRouter.get('/fridges', catchAsync(async (req, res) => {
      
 const fridge = await fridgeService.findFridgeDetail(1);
 res.json(apiResponse.ok(fridge));
}));

