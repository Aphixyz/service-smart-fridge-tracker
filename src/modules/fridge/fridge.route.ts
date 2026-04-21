import { Router, type Response } from 'express';
import { apiResponse } from '../../common/response/ApiResponse.ts';
import { authMiddleware } from '../../common/middleware/auth.middleware.ts';
import { catchAsync } from '../../common/utils/catchAsync.ts';
import { fridgeService } from './fridge.service.ts';
import type { AuthRequest } from '../auth/auth.type.ts';
import { RequestFridgeProduct } from './fridge.type.ts';

export const fridgeRouter = Router();

fridgeRouter.get('/fridges', authMiddleware, catchAsync(async (req: AuthRequest, res: Response) => {
    const homeId = req.user!.id;
    const fridge = await fridgeService.findFridgeDetailByHomeId(homeId);
    res.json(apiResponse.ok(fridge));
}));

fridgeRouter.get('/fridges/:fridgeId/products', authMiddleware, catchAsync(async (req: AuthRequest, res: Response) => {
    const fridgeId = Number(req.params.fridgeId);
    const products = await fridgeService.findProductsByFridgeId(fridgeId);
    res.json(apiResponse.ok(products));
}));

fridgeRouter.delete('/fridges/:fridgeId/products/:productId', authMiddleware, catchAsync(async (req: AuthRequest, res: Response) => {
    const fridgeId = Number(req.params.fridgeId);
    const productId = Number(req.params.productId);
    const product = await fridgeService.deleteProduct(fridgeId, productId);
    res.json(apiResponse.ok(product));
}));

fridgeRouter.post('/fridges/:fridgeId/products', authMiddleware, catchAsync(async (req: RequestFridgeProduct, res: Response) => {
    const fridgeId = Number(req.params.fridgeId);   
    const product = await fridgeService.insertProduct(fridgeId, req);
    res.json(apiResponse.ok(product));
}));



