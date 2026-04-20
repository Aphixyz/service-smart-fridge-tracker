import { Router, type Response } from 'express';
import { apiResponse } from '../../common/response/ApiResponse.ts';
import { authMiddleware } from '../../common/middleware/auth.middleware.ts';
import { catchAsync } from '../../common/utils/catchAsync.ts';
import { fridgeService } from './fridge.service.ts';
import type { AuthRequest } from '../auth/auth.type.ts';

export const fridgeRouter = Router();

fridgeRouter.get('/fridges', authMiddleware, catchAsync(async (req: AuthRequest, res: Response) => {
    const homeId = req.user!.id;
    const fridge = await fridgeService.findFridgeDetailByHomeId(homeId);
    res.json(apiResponse.ok(fridge));
}));

fridgeRouter.get('/fridges/:fridgeId/products', authMiddleware, catchAsync(async (req: AuthRequest, res: Response) => {
    const fridgeId = parseInt(req.params.fridgeId as string);
    const products = await fridgeService.findProductsByFridgeId(fridgeId);
    res.json(apiResponse.ok(products));
}));
