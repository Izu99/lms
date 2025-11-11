import express from 'express';
import next from 'next';

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Handle all routes with Next.js
  server.use((req, res) => {
    return handle(req, res);
  });

  const port = parseInt(process.env.PORT, 10) || 3000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`✅ Frontend running on port ${port}`);
  });
});
