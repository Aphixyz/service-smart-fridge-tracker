import fs from "fs";
import path from "path";

const moduleName = process.argv[2];

if (!moduleName) {
    console.log("Please provide module name");
    console.log("Example: npm run create:module -- fridge");
    process.exit(1);
}

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
const pluralName = `${camelName}s`;

const files = {
    [`${moduleName}.docs.ts`]: `/**
 * @swagger
 * tags:
 *   name: ${pascalName}
 *   description: ${pascalName} management module
 */
`,

    [`${moduleName}.repository.ts`]: `import db from "../../common/database/db.ts";

export const ${camelName}Repository = {
  findAll: async () => {
    const sql = \`
      SELECT *
      FROM ${pluralName}
      ORDER BY id ASC;
    \`;

    const result = await db.query(sql);
    return result.rows;
  },

  findById: async (id: number) => {
    const sql = \`
      SELECT *
      FROM ${pluralName}
      WHERE id = $1
      LIMIT 1;
    \`;

    const result = await db.query(sql, [id]);
    return result.rows[0] ?? null;
  },

  create: async (payload: { name: string }) => {
    const sql = \`
      INSERT INTO ${pluralName} (name)
      VALUES ($1)
      RETURNING *;
    \`;

    const result = await db.query(sql, [payload.name]);
    return result.rows[0];
  },

  update: async (id: number, payload: { name: string }) => {
    const sql = \`
      UPDATE ${pluralName}
      SET name = $1
      WHERE id = $2
      RETURNING *;
    \`;

    const result = await db.query(sql, [payload.name, id]);
    return result.rows[0] ?? null;
  },

  remove: async (id: number) => {
    const sql = \`
      DELETE FROM ${pluralName}
      WHERE id = $1
      RETURNING *;
    \`;

    const result = await db.query(sql, [id]);
    return result.rows[0] ?? null;
  },
};
`,

    [`${moduleName}.route.ts`]: `import { Router, type Response } from "express";
import { apiResponse } from "../../common/response/ApiResponse.ts";
import { authMiddleware } from "../../common/middleware/auth.middleware.ts";
import { catchAsync } from "../../common/utils/catchAsync.ts";
import { ${camelName}Service } from "./${moduleName}.service.ts";
import { ${pascalName}Schema, validate } from "./${moduleName}.validator.ts";
import type { AuthRequest } from "../auth/auth.type.ts";

export const ${camelName}Router = Router();

${camelName}Router.get(
  "/${pluralName}",
  authMiddleware,
  catchAsync(async (_req: AuthRequest, res: Response) => {
    const data = await ${camelName}Service.findAll();
    res.json(apiResponse.ok(data));
  })
);

${camelName}Router.get(
  "/${pluralName}/:id",
  authMiddleware,
  catchAsync(async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const data = await ${camelName}Service.findById(id);
    res.json(apiResponse.ok(data));
  })
);

${camelName}Router.post(
  "/${pluralName}",
  authMiddleware,
  catchAsync(async (req: AuthRequest, res: Response) => {
    const payload = validate(${pascalName}Schema.create)(req.body);
    const data = await ${camelName}Service.create(payload);
    res.json(apiResponse.created(data));
  })
);

${camelName}Router.put(
  "/${pluralName}/:id",
  authMiddleware,
  catchAsync(async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const payload = validate(${pascalName}Schema.update)(req.body);
    const data = await ${camelName}Service.update(id, payload);
    res.json(apiResponse.ok(data));
  })
);

${camelName}Router.delete(
  "/${pluralName}/:id",
  authMiddleware,
  catchAsync(async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const data = await ${camelName}Service.remove(id);
    res.json(apiResponse.ok(data));
  })
);
`,

    [`${moduleName}.service.ts`]: `import { ${camelName}Repository } from "./${moduleName}.repository.ts";
import { appError } from "../../common/error/AppError.ts";
import type {
  Create${pascalName}Payload,
  Update${pascalName}Payload,
} from "./${moduleName}.type.ts";

export const ${camelName}Service = {
  findAll: async () => {
    return await ${camelName}Repository.findAll();
  },

  findById: async (id: number) => {
    const data = await ${camelName}Repository.findById(id);

    if (!data) {
      throw appError.notFound("${pascalName} not found");
    }

    return data;
  },

  create: async (payload: Create${pascalName}Payload) => {
    return await ${camelName}Repository.create(payload);
  },

  update: async (id: number, payload: Update${pascalName}Payload) => {
    const found = await ${camelName}Repository.findById(id);

    if (!found) {
      throw appError.notFound("${pascalName} not found");
    }

    return await ${camelName}Repository.update(id, {
      name: payload.name ?? found.name,
    });
  },

  remove: async (id: number) => {
    const found = await ${camelName}Repository.findById(id);

    if (!found) {
      throw appError.notFound("${pascalName} not found");
    }

    return await ${camelName}Repository.remove(id);
  },
};
`,

    [`${moduleName}.type.ts`]: `export interface ${pascalName} {
  id: number;
  name: string;
  [key: string]: any;
}

export interface Create${pascalName}Payload {
  name: string;
}

export interface Update${pascalName}Payload {
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
  (schema: z.ZodSchema) =>
  (data: unknown) => {
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