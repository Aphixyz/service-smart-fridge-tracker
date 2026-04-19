import { Router } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { routeLoaderService } from '../services/routeLoader.service.ts';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ปรับมาสแกนในโฟลเดอร์ src/modules แทน
const modulesPath = path.join(__dirname, '../modules');

// โหลดทุกไฟล์ที่เป็น .route.js ในทุก subfolder ของ modules
await routeLoaderService.load(modulesPath, router);

// Health Check
router.get('/health', (req, res: any) => {
  res.json({ status: 'ok', modules: 'loaded' });
});

export { router };
