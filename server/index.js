import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT) || 10000;

const allowedOrigins = (process.env.FRONTEND_URL ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
  }),
);

app.use(express.json({ limit: '2mb' }));

app.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'savanna-luxe-api',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/status', (_request, response) => {
  response.json({
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    environment: process.env.NODE_ENV ?? 'development',
  });
});

app.get('/', (_request, response) => {
  response.json({
    message: 'Savanna Luxe API — use /health or /api/status',
  });
});

app.listen(port, () => {
  console.log(`Savanna Luxe API listening on port ${port}`);
});
