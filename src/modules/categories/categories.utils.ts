import type { AuthRequest } from "../auth/auth.type.ts";
import { appError } from "../../common/error/AppError.ts";
import { uploadMiddlewareFactory } from "../../common/middleware/upload.middleware.ts";
import { uploadRequestUtils } from "../../common/utils/uploadRequest.ts";
import { categoriesSchema, validate } from "./categories.validator.ts";
import type {
  CreatecategoriesInput,
  UpdatecategoriesInput,
} from "./categories.type.ts";

const CATEGORY_ICON_FOLDER = "categories";
const CATEGORY_ICON_FIELD = "icon";

const resolveIconInput = (req: AuthRequest): string | undefined =>
  uploadRequestUtils.getUploadedFilePublicPath(req, CATEGORY_ICON_FOLDER) ??
  req.body.icon;

export const categoriesUtils = {
  uploadCategoryIcon: uploadMiddlewareFactory.createSingleImageUpload(
    CATEGORY_ICON_FIELD,
    CATEGORY_ICON_FOLDER,
  ),

  getCategoryId(id: string | string[]): number {
    return validate(categoriesSchema.params)({
      id: Array.isArray(id) ? id[0] : id,
    }).id;
  },

  getCreateCategoryInput(req: AuthRequest): CreatecategoriesInput {
    const body = validate(categoriesSchema.create)({
      name: req.body.name,
      icon: resolveIconInput(req),
    });

    if (!body.icon) {
      throw appError.badRequest("icon: Icon is required");
    }
    return {
      home_id: req.user?.id ?? null,
      name: body.name,
      icon: body.icon,
    };
  },

  getUpdateCategoryInput(req: AuthRequest): UpdatecategoriesInput {
    const body = validate(categoriesSchema.update)({
      name: req.body.name,
      icon: resolveIconInput(req),
    });

    return {
      home_id: req.user?.id ?? null,
      name: body.name,
      icon: body.icon,
    };
  },

  async runWithUploadedIconCleanup<T>(
    req: AuthRequest,
    action: () => Promise<T>,
  ): Promise<T> {
    return uploadRequestUtils.runWithUploadedFileCleanup(
      req,
      CATEGORY_ICON_FOLDER,
      action,
    );
  },
};
