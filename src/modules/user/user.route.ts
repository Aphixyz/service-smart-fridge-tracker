import { Router } from 'express';
import { userService } from './user.service.ts';
import { apiResponse } from '../../common/response/ApiResponse.ts';
import { UserSchema, validate } from './user.validator.ts';
import { authMiddleware } from '../../common/middleware/auth.middleware.ts';
import { catchAsync } from '../../common/utils/catchAsync.ts';

export const userRouter = Router();

userRouter.get('/users', catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { data, total } = await userService.findAll({ page, limit });
  res.json(apiResponse.paginated(data, page, limit, total));
}));

userRouter.get('/users/:id', catchAsync(async (req, res) => {
  const user = await userService.findById(Number(req.params.id));
  res.json(apiResponse.ok(user));
}));

userRouter.post('/users', catchAsync(async (req, res) => {
  const data = validate(UserSchema.create)(req.body);
  const user = await userService.create(data);
  res.status(201).json(apiResponse.created(user));
}));

userRouter.delete('/users/:id', authMiddleware, catchAsync(async (req, res) => {
  await userService.remove(Number(req.params.id));
  res.json(apiResponse.ok(null, 'User deleted'));
}));
