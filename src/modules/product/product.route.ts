import { Router, type Response } from "express";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import { authMiddleware } from "../../common/middleware/auth.middleware.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { productService } from "./product.service.ts";
import type { AuthRequest } from "../auth/auth.type.ts";

export const productRouter = Router();


productRouter.get(
    "/products/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = Number(req.params.id);
        const data = await productService.findById(id);
        res.json(apiResponse.ok(data));
    }),
);

productRouter.patch(
    "/products/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = Number(req.params.id);
        const data = await productService.updateProcut(id, req.body);
        res.json(apiResponse.ok(data));
    }),
);




