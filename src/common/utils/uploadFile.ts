import { promises as fs } from "fs";
import path from "path";

export const uploadsRoot = path.resolve(process.cwd(), "uploads");

export const ensureUploadDir = async (...segments: string[]): Promise<string> => {
  const directory = path.join(uploadsRoot, ...segments);
  await fs.mkdir(directory, { recursive: true });
  return directory;
};

export const buildUploadPublicPath = (...segments: string[]): string =>
  `/${["uploads", ...segments].join("/")}`;

export const resolveUploadAbsolutePath = (publicPath: string): string | null => {
  if (!publicPath.startsWith("/uploads/")) {
    return null;
  }

  // อนุญาตให้ลบได้เฉพาะไฟล์ที่อยู่ใต้ /uploads เท่านั้น
  const relativePath = publicPath.replace(/^\/uploads\//, "");
  const absolutePath = path.resolve(uploadsRoot, relativePath);

  if (!absolutePath.startsWith(uploadsRoot)) {
    return null;
  }

  return absolutePath;
};

export const removeProjectUpload = async (
  publicPath?: string | null,
): Promise<void> => {
  if (!publicPath) {
    return;
  }

  const absolutePath = resolveUploadAbsolutePath(publicPath);

  if (!absolutePath) {
    return;
  }

  try {
    await fs.unlink(absolutePath);
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
};
