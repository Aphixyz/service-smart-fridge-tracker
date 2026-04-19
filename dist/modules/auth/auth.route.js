import { Router } from 'express';
import { authService } from './auth.service.ts';
import { catchAsync } from '../../common/utils/catchAsync.ts';
import { apiResponse } from '../../common/response/ApiResponse.ts';
export const authRouter = Router();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: {type: string}
 *               password: {type: string}
 */
authRouter.post('/auth/login', catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(apiResponse.ok(result, 'Login successful'));
}));
//# sourceMappingURL=auth.route.js.map