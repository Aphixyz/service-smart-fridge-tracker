import fs from "fs";
import path from "path";

const rawModuleName = process.argv[2]?.trim();

if (!rawModuleName) {
  console.log("Please provide module name");
  console.log("Example: npm run create:module -- fridge");
  process.exit(1);
}

const moduleName = rawModuleName.toLowerCase();
const moduleDir = path.join(process.cwd(), "src", "modules", moduleName);

const toCamelCase = (str) =>
  str
    .toLowerCase()
    .replace(/[-_](\w)/g, (_, char) => char.toUpperCase());

const toPascalCase = (str) => {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const camelName = toCamelCase(moduleName);
const pascalName = toPascalCase(moduleName);
const routeName = moduleName;
const routePluralName = `${routeName}s`;
const tableName = moduleName.replace(/-/g, "_");
const tablePluralName = `${tableName}s`;

const files = {
  [`${moduleName}.docs.ts`]: `/**
 * @swagger
 * tags:
 *   name: ${pascalName}
 *   description: ${pascalName} module
 */
`,

  [`${moduleName}.repository.ts`]: `import db from "../../common/database/db.ts";
import type {
    ${pascalName},
    Create${pascalName}Input,
    Update${pascalName}Input,
} from "./${moduleName}.type.ts";

export const ${camelName}Repository = {
    findAll: async (): Promise<${pascalName}[]> => {
        const sql = \`
            SELECT *
            FROM ${tablePluralName}
            ORDER BY id ASC;
        \`;

        const { rows } = await db.query<${pascalName}>(sql);
        return rows;
    },

    findById: async (id: number): Promise<${pascalName} | null> => {
        const sql = \`
            SELECT *
            FROM ${tablePluralName}
            WHERE id = $1
            LIMIT 1;
        \`;

        const { rows } = await db.query<${pascalName}>(sql, [id]);
        return rows[0] ?? null;
    },

    create: async (data: Create${pascalName}Input): Promise<${pascalName} | null> => {
        const sql = \`
            INSERT INTO ${tablePluralName} (name)
            VALUES ($1)
            RETURNING *;
        \`;

        const values = [data.name];
        const { rows } = await db.query<${pascalName}>(sql, values);
        return rows[0] ?? null;
    },

    update: async (id: number, data: Update${pascalName}Input): Promise<${pascalName} | null> => {
        const sql = \`
            UPDATE ${tablePluralName}
            SET name = $1
            WHERE id = $2
            RETURNING *;
        \`;

        const values = [data.name, id];
        const { rows } = await db.query<${pascalName}>(sql, values);
        return rows[0] ?? null;
    },

    remove: async (id: number): Promise<${pascalName} | null> => {
        const sql = \`
            DELETE FROM ${tablePluralName}
            WHERE id = $1
            RETURNING *;
        \`;

        const { rows } = await db.query<${pascalName}>(sql, [id]);
        return rows[0] ?? null;
    },
};
`,

  [`${moduleName}.route.ts`]: `import { Router, type Response } from "express";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import { authMiddleware } from "../../common/middleware/auth.middleware.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { ${camelName}Service } from "./${moduleName}.service.ts";
import type { AuthRequest } from "../auth/auth.type.ts";
import { ${pascalName}Schema, validate } from "./${moduleName}.validator.ts";

export const ${camelName}Router = Router();

${camelName}Router.get(
    "/${routePluralName}",
    authMiddleware,
    catchAsync(async (_req: AuthRequest, res: Response) => {
        const data = await ${camelName}Service.findAll();
        res.json(apiResponse.ok(data));
    }),
);

${camelName}Router.get(
    "/${routePluralName}/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = parseInt(req.params.id as string, 10);
        const data = await ${camelName}Service.findById(id);
        res.json(apiResponse.ok(data));
    }),
);

${camelName}Router.post(
    "/${routePluralName}",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const data = validate(${pascalName}Schema.create)(req.body);
        const created = await ${camelName}Service.create(data);
        res.status(201).json(apiResponse.created(created));
    }),
);

${camelName}Router.put(
    "/${routePluralName}/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = parseInt(req.params.id as string, 10);
        const data = validate(${pascalName}Schema.update)(req.body);
        const updated = await ${camelName}Service.update(id, data);
        res.json(apiResponse.ok(updated));
    }),
);

${camelName}Router.delete(
    "/${routePluralName}/:id",
    authMiddleware,
    catchAsync(async (req: AuthRequest, res: Response) => {
        const id = parseInt(req.params.id as string, 10);
        const removed = await ${camelName}Service.remove(id);
        res.json(apiResponse.ok(removed));
    }),
);
`,

  [`${moduleName}.service.ts`]: `import { appError } from "../../common/error/AppError.ts";
import { ${camelName}Repository } from "./${moduleName}.repository.ts";
import type {
    ${pascalName},
    Create${pascalName}Input,
    Update${pascalName}Input,
} from "./${moduleName}.type.ts";

export const ${camelName}Service = {
    async findAll(): Promise<${pascalName}[]> {
        return ${camelName}Repository.findAll();
    },

    async findById(id: number): Promise<${pascalName}> {
        const item = await ${camelName}Repository.findById(id);

        if (!item) {
            throw appError.notFound("${pascalName} not found");
        }

        return item;
    },

    async create(data: Create${pascalName}Input): Promise<${pascalName}> {
        const created = await ${camelName}Repository.create(data);

        if (!created) {
            throw appError.internal("Failed to create ${camelName}");
        }

        return created;
    },

    async update(id: number, data: Update${pascalName}Input): Promise<${pascalName}> {
        const item = await this.findById(id);

        const updated = await ${camelName}Repository.update(id, {
            name: data.name ?? item.name,
        });

        if (!updated) {
            throw appError.internal("Failed to update ${camelName}");
        }

        return updated;
    },

    async remove(id: number): Promise<${pascalName}> {
        await this.findById(id);

        const removed = await ${camelName}Repository.remove(id);

        if (!removed) {
            throw appError.internal("Failed to remove ${camelName}");
        }

        return removed;
    },
};
`,

  [`${moduleName}.type.ts`]: `export interface ${pascalName} {
    id: number;
    name: string;
    [key: string]: unknown;
}

export interface Create${pascalName}Input {
    name: string;
}

export interface Update${pascalName}Input {
    name?: string;
}
`,

  [`${moduleName}.validator.ts`]: `import { z } from "zod";
import { appError } from "../../common/error/AppError.ts";

export const ${pascalName}Schema = {
    create: z.object({
        name: z.string().min(1, "Name is required"),
    }),

    update: z.object({
        name: z.string().min(1, "Name is required").optional(),
    }),
};

export const validate =
    <T>(schema: z.ZodType<T>) =>
    (data: unknown): T => {
        const result = schema.safeParse(data);

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => \`\${issue.path.join(".")}: \${issue.message}\`)
                .join(", ");

            throw appError.badRequest(message);
        }

        return result.data;
    };
`,
};

if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir, { recursive: true });
}

for (const [fileName, content] of Object.entries(files)) {
  const filePath = path.join(moduleDir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(`Skip: ${fileName} already exists`);
    continue;
  }
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Created: ${filePath}`);
}
