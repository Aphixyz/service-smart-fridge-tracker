import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router } from './routes/index.ts';
import { errorHandler, notFoundHandler } from './common/middleware/errorHandler.ts';
import { globalRateLimiter } from './common/middleware/rateLimiter.ts';
import { setupSwagger } from './config/swagger.config.ts';

const app = express();

// ── Security & Utility Middleware ──
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(globalRateLimiter);

// ── Documentation ──
setupSwagger(app);

// ── API Routes ──
app.use('/api/v1', router);

// ── Error Handling ──
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
