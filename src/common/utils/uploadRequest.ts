import type { Request } from "express";
import { buildUploadPublicPath, removeProjectUpload } from "./uploadFile.ts";

export const uploadRequestUtils = {
  getUploadedFilePublicPath(
    req: Request,
    folder: string,
  ): string | undefined {
    if (!req.file) {
      return undefined;
    }

    return buildUploadPublicPath(folder, req.file.filename);
  },

  async runWithUploadedFileCleanup<T>(
    req: Request,
    folder: string,
    action: () => Promise<T>,
  ): Promise<T> {
    const uploadedFilePath = this.getUploadedFilePublicPath(req, folder);

    try {
      return await action();
    } catch (error) {
      await removeProjectUpload(uploadedFilePath);
      throw error;
    }
  },
};
