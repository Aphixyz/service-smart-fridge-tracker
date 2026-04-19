import { Router } from 'express';
import { apiResponse } from '../../common/response/ApiResponse.ts';
import { authMiddleware } from '../../common/middleware/auth.middleware.ts';
import { catchAsync } from '../../common/utils/catchAsync.ts';

export const fridgeRouter = Router();

fridgeRouter.get('/fridges', catchAsync(async (req, res) => {
      
  res.json(apiResponse.ok({ message: 'Fridges endpoint' }));
}));

