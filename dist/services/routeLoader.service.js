import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Router } from 'express';
export const routeLoaderService = {
    /**
     * สแกนหาไฟล์ .route.ts แบบ Recursive (สแกนลงไปใน subfolders)
     */
    load: async (directory, mainRouter) => {
        try {
            const getFiles = (dir) => {
                let results = [];
                const list = fs.readdirSync(dir);
                list.forEach(file => {
                    const filePath = path.join(dir, file);
                    const stat = fs.statSync(filePath);
                    if (stat && stat.isDirectory()) {
                        results = results.concat(getFiles(filePath));
                    }
                    else {
                        if (filePath.endsWith('.route.ts')) {
                            results.push(filePath);
                        }
                    }
                });
                return results;
            };
            const routeFiles = getFiles(directory);
            for (const filePath of routeFiles) {
                const fileUrl = pathToFileURL(filePath).href;
                const module = await import(fileUrl);
                const routeModule = module.default || Object.values(module).find((val) => typeof val === 'function' || (val && val.stack));
                if (routeModule) {
                    mainRouter.use(routeModule);
                    console.log(`[RouteLoader]  Loaded: ${path.basename(filePath)}`);
                }
            }
        }
        catch (error) {
            console.error(`[RouteLoader]  Error scanning modules:`, error);
        }
    }
};
//# sourceMappingURL=routeLoader.service.js.map