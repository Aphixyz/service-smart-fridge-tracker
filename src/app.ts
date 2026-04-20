import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { router } from './routes/index.ts';
import { errorHandler, notFoundHandler } from './common/middleware/errorHandler.ts';
import { globalRateLimiter } from './common/middleware/rateLimiter.ts';
import { setupSwagger } from './config/swagger.config.ts';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(process.cwd(), "uploads"))
);

// ── Security & Utility Middleware ──
app.use(helmet());
app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(globalRateLimiter);
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// ── Documentation ──
setupSwagger(app);

// ── API Routes ──
app.use('/api/v1', router);

// ── Error Handling ──
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
