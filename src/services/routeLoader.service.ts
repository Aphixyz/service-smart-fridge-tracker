import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { Router } from "express";

export const routeLoaderService = {
  load: async (directory: string, mainRouter: Router): Promise<void> => {
    try {
      const getFiles = (dir: string): string[] => {
        let results: string[] = [];
        const list = fs.readdirSync(dir);

        list.forEach((file) => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            results = results.concat(getFiles(filePath));
          } else {
            if (
              filePath.endsWith(".route.ts") ||
              filePath.endsWith(".route.js")
            ) {
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

        const routeModule =
          module.default ||
          Object.values(module).find(
            (val: any) => val && typeof val === "function" && "use" in val,
          ) ||
          Object.values(module).find((val: any) => val && (val as any).stack);

        if (routeModule) {
          mainRouter.use(routeModule as Router);
          console.log(`[RouteLoader] Loaded: ${path.basename(filePath)}`);
        } else {
          console.warn(`[RouteLoader] No router export found in: ${filePath}`);
        }
      }
    } catch (error) {
      console.error(`[RouteLoader] Error scanning modules:`, error);
    }
  },
};
