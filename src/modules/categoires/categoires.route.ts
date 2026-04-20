import { Router, type Response } from "express";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import { authMiddleware } from "../../common/middleware/auth.middleware.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { categoiresService } from "./categoires.service.ts";
import type { AuthRequest } from "../auth/auth.type.ts";
import { categoiresUtils } from "./categoires.utils.ts";

export const categoiresRouter = Router();

categoiresRouter.get(
    "/categoires",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const auth_id = req.user!.id;
        const data = await categoiresService.getAllCategories(auth_id);
        res.json(apiResponse.ok(data));
    }),
);

categoiresRouter.get(
    "/categoires/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = categoiresUtils.getCategoryId(req.params.id);
        const data = await categoiresService.getCategoryById(id);
        res.json(apiResponse.ok(data));
    }),
);

categoiresRouter.post(
    "/categoires",
    authMiddleware,
    categoiresUtils.uploadCategoryIcon,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const created = await categoiresUtils.runWithUploadedIconCleanup(req, async () => {
            const data = categoiresUtils.getCreateCategoryInput(req);
            return categoiresService.create(data);
        });
        res.status(201).json(apiResponse.created(created));
    }),
);

categoiresRouter.put(
    "/categoires/:id",
    authMiddleware,
    categoiresUtils.uploadCategoryIcon,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = categoiresUtils.getCategoryId(req.params.id);
        const updated = await categoiresUtils.runWithUploadedIconCleanup(req, async () => {
            const data = categoiresUtils.getUpdateCategoryInput(req);
            return categoiresService.update(id, data);
        });
        res.json(apiResponse.ok(updated));
    }),
);

categoiresRouter.delete(
    "/categoires/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = categoiresUtils.getCategoryId(req.params.id);
        const removed = await categoiresService.remove(id);
        res.json(apiResponse.ok(removed));
    }),
);
