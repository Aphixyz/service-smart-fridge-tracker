import path from "path";
import multer, { MulterError } from "multer";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { appError } from "../error/AppError.ts";
import { ensureUploadDir } from "../utils/uploadFile.ts";

interface CreateSingleFileUploadOptions {
  fieldName: string;
  folder: string;
  allowedMimeTypes: string[];
  invalidMimeTypeMessage: string;
  maxFileSizeMessage: string;
  maxFileSize?: number;
}

const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024;

const sanitizeFilename = (filename: string): string =>
  filename
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "file";

const createSingleFileUpload = (
  options: CreateSingleFileUploadOptions,
): RequestHandler => {
  const uploader = multer({
    storage: multer.diskStorage({
      destination: async (_req, _file, cb) => {
        try {
          const destination = await ensureUploadDir(options.folder);
          cb(null, destination);
        } catch (error) {
          cb(error as Error, "");
        }
      },
      filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const safeName = sanitizeFilename(file.originalname);
        cb(null, `${safeName}-${uniqueSuffix}${extension}`);
      },
    }),
    limits: {
      fileSize: options.maxFileSize ?? DEFAULT_MAX_FILE_SIZE,
      files: 1,
    },
    fileFilter: (_req, file, cb) => {
      if (!options.allowedMimeTypes.includes(file.mimetype)) {
        cb(appError.badRequest(options.invalidMimeTypeMessage));
        return;
      }

      cb(null, true);
    },
  }).single(options.fieldName);

  return (req: Request, res: Response, next: NextFunction): void => {
    uploader(req, res, (error) => {
      if (error instanceof MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          next(appError.badRequest(options.maxFileSizeMessage));
          return;
        }

        next(appError.badRequest(error.message));
        return;
      }

      if (error) {
        next(error);
        return;
      }

      next();
    });
  };
};

export const uploadMiddlewareFactory = {
  imageMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/gif",
  ],

  createSingleFileUpload,

  createSingleImageUpload(
    fieldName: string,
    folder: string,
    options?: {
      invalidMimeTypeMessage?: string;
      maxFileSizeMessage?: string;
      maxFileSize?: number;
    },
  ): RequestHandler {
    return createSingleFileUpload({
      fieldName,
      folder,
      allowedMimeTypes: this.imageMimeTypes,
      invalidMimeTypeMessage:
        options?.invalidMimeTypeMessage ??
        `${fieldName}: Only image files are allowed`,
      maxFileSizeMessage:
        options?.maxFileSizeMessage ??
        `${fieldName}: Maximum file size is 5MB`,
      maxFileSize: options?.maxFileSize,
    });
  },
};
