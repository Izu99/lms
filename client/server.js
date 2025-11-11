import express from 'express';
import next from 'next';

const app = next({ dev: false }); // production mode
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Handle all routes with Next.js
  server.use((req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`✅ Frontend running on port ${port}`);
  });
});
