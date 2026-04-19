import 'dotenv/config';
import app from './app.ts';
import { checkDbConnection } from './common/database/db.ts';
const PORT: string | number = process.env.PORT || 3001;
checkDbConnection(); // ไม่ต้อง await เพื่อให้ server รันขึ้นมาก่อน

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = async (): Promise<void> => {
  console.log('\nBye bye! Closing server...');
  server.close(async () => {
    const { default: db } = await import('./common/database/db.ts');
    await db.end();
    console.log('Database pool closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
