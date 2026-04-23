import { Router, type Response } from "express";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import { authMiddleware } from "../../common/middleware/auth.middleware.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { categoriesService } from "./categories.service.ts";
import type { AuthRequest } from "../auth/auth.type.ts";
import { categoriesUtils } from "./categories.utils.ts";

export const categoriesRouter = Router();

categoriesRouter.get(
    "/categories",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const auth_id = req.user!.id;
        const data = await categoriesService.getAllCategories(auth_id);
        res.json(apiResponse.ok(data));
    }),
);

categoriesRouter.get(
    "/categories/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const authId = req.user!.id;
        const id = categoriesUtils.getCategoryId(req.params.id);
        const data = await categoriesService.getCategoryById(id, authId);
        res.json(apiResponse.ok(data));
    }),
);

categoriesRouter.post(
    "/categories",
    authMiddleware,
    categoriesUtils.uploadCategoryIcon,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const created = await categoriesUtils.runWithUploadedIconCleanup(req, async () => {
            const data = categoriesUtils.getCreateCategoryInput(req);
            return categoriesService.create(data);
        });
        res.status(201).json(apiResponse.created(created));
    }),
);

categoriesRouter.put(
    "/categories/:id",
    authMiddleware,
    categoriesUtils.uploadCategoryIcon,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const authId = req.user!.id;
        const id = categoriesUtils.getCategoryId(req.params.id);
        const updated = await categoriesUtils.runWithUploadedIconCleanup(req, async () => {
            const data = categoriesUtils.getUpdateCategoryInput(req);
            return categoriesService.update(id, authId, data);
        });
        res.json(apiResponse.ok(updated));
    }),
);

categoriesRouter.delete(
    "/categories/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = categoriesUtils.getCategoryId(req.params.id);
        const removed = await categoriesService.remove(id);
        res.json(apiResponse.ok(removed));
    }),
);
