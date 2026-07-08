import express from 'express';
import { Worker } from 'node:worker_threads';

const app = express();
const port = process.env.PORT || 3000;

app.get('/non-blocking', (req, res) => {
  const startedAt = Date.now();

  const durationMs = Date.now() - startedAt;

  res.status(200).json({
    message: 'This route is non-blocking.',
    durationMs,
  });
});

app.get('/blocking', (req, res) => {
  const startedAt = Date.now();

  const worker = new Worker(new URL('./worker.js', import.meta.url));

  worker.on('message', (result) => {
    const durationMs = Date.now() - startedAt;

    res.status(200).json({
      message: 'Task completed with worker',
      result,
      durationMs,
    });
  });

  worker.on('error', (error) => {
    res.status(500).send(`Worker error: ${error.message}`);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});