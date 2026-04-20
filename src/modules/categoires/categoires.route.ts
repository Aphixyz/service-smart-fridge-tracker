import { Router, type Response } from "express";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import { authMiddleware } from "../../common/middleware/auth.middleware.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { categoiresService } from "./categoires.service.ts";
import type { AuthRequest } from "../auth/auth.type.ts";
import { CategoiresSchema, validate } from "./categoires.validator.ts";
import { upload } from "../../common/middleware/upload.ts"; 

export const categoiresRouter = Router();

categoiresRouter.get(
    "/categoires",
    authMiddleware,
    catchAsync(async (_req: AuthRequest, res: Response) => {    
        const data = await categoiresService.getAllCategories();
        res.json(apiResponse.ok(data));
    }),
);

categoiresRouter.get(
    "/categoires/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const data = await categoiresService.getCategoryById(id as any);
        res.json(apiResponse.ok(data));
    }),
);

categoiresRouter.post(
    "/categoires",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const data = validate(CategoiresSchema.create)(req.body);
        const created = await categoiresService.create(data as any );
        res.status(201).json(apiResponse.created(created));
    }),
);

categoiresRouter.put(
    "/categoires/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const data = validate(CategoiresSchema.update)(req.body);
        const updated = await categoiresService.update(id as any, data as any);
        res.json(apiResponse.ok(updated));
    }),
);

categoiresRouter.delete(
    "/categoires/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const removed = await categoiresService.remove(id as any);
        res.json(apiResponse.ok(removed));
    }),
);
