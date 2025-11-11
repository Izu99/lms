import express from 'express';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

app.prepare().then(() => {
  const server = express();

  // Health check endpoint for Azure
  server.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });

  // Handle all other routes with Next.js - using middleware
  server.use((req, res, next) => {
    // Skip health check
    if (req.path === '/health') {
      return next();
    }
    return handle(req, res);
  });

  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
