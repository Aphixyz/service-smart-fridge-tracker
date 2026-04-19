import { Router } from 'express';
export declare const routeLoaderService: {
    /**
     * สแกนหาไฟล์ .route.ts แบบ Recursive (สแกนลงไปใน subfolders)
     */
    load: (directory: string, mainRouter: Router) => Promise<void>;
};
//# sourceMappingURL=routeLoader.service.d.ts.map