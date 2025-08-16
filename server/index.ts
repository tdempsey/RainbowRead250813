// server/index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

/** Read a CLI flag value like --port 9002 */
const getArg = (flag: string) => {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : undefined;
};

// ---- Prefer IPv4; avoid ::1 on Windows
const PORT = Number(process.env.PORT ?? getArg('--port') ?? 9002);
let HOST = (process.env.HOST ?? getArg('--host') ?? '127.0.0.1').trim();
if (HOST === '::' || HOST === '::1' || HOST.toLowerCase() === 'localhost') {
  HOST = '127.0.0.1';
}

// ---- Create app BEFORE listen
const app = express();

// ---- Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ---- Health check
app.get('/health', (_req, res) => res.json({ ok: true, host: HOST, port: PORT }));

// ---- TODO: add your routes here
// import router from './routes';
// app.use('/api', router);

// ---- If you have bootstrap/dummy data loaders, call them AFTER app exists
// await import('./bootstrap'); // or await loadDummyData();

// ---- Start server AFTER everything above
const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

// ---- Optional: start background jobs AFTER server is up
// import('./scheduler').then(m => m.start?.(server)).catch(err => console.error('Scheduler start failed:', err));

// ---- Error handling
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} in use. Set PORT to a free port.`);
  } else if (err.code === 'ENOTSUP') {
    console.error(`Binding to ${HOST} not supported. Try HOST=127.0.0.1 or HOST=0.0.0.0.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

// ---- Graceful shutdown
process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
