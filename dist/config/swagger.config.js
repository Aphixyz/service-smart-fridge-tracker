import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Professional API Template',
            version: '1.0.0',
            description: 'Express.js API with Module-based architecture, Repository pattern, and Clean Code.',
        },
        servers: [
            {
                url: `${(process.env.BASE_URL || 'http://localhost:3001').replace(/\/$/, '')}/api/v1`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/modules/**/*.route.ts', './src/routes/*.ts'],
};
const specs = swaggerJsdoc(options);
export const setupSwagger = (app) => {
    // ━━━ คืนค่าบรรทัดนี้ที่หายไป ━━━
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    // จัดการเรื่อง Slash ให้สวยงาม
    const baseUrl = (process.env.BASE_URL || 'http://localhost:3001').replace(/\/$/, '');
    console.log(`Swagger Docs available at ${baseUrl}/api-docs`);
};
//# sourceMappingURL=swagger.config.js.map