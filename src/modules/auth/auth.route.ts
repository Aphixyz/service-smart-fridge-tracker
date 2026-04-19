import { Router } from 'express';
import { authService } from './auth.service.ts';
import { catchAsync } from '../../common/utils/catchAsync.ts';
import { apiResponse } from '../../common/response/ApiResponse.ts';

export const authRouter = Router();

authRouter.post('/auth/login', catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(apiResponse.ok(result, 'Login successful'));
}));
