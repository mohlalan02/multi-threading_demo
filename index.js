import express from 'express';
import { Worker } from 'node:worker_threads';

const app = express();
const port = process.env.PORT || 3000;
const THREAD_COUNT = 4;
const TOTAL_COUNT = 10_000_000_000;

function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.js', import.meta.url), {
      workerData: {
        threadCount: THREAD_COUNT,
        totalCount: TOTAL_COUNT,
      },
    });

    worker.on('message', (data) => {
      resolve(data);
    });

    worker.on('error', (error) => {
      reject(error);
    });
  });
}

app.get('/non-blocking', (req, res) => {
  res.status(200).send('This page is non-blocking.');
});

app.get('/blocking', async (req, res) => {
  const startedAt = Date.now();

  try {
    const workerPromises = [];

    for (let i = 0; i < THREAD_COUNT; i++) {
      workerPromises.push(createWorker());
    }

    const threadResults = await Promise.all(workerPromises);
    const total = threadResults.reduce((sum, result) => sum + result, 0);
    const taskDurationMs = Date.now() - startedAt;

    res.status(200).json({
      message: 'Task completed using multiple workers',
      workersUsed: THREAD_COUNT,
      result: total,
      taskDurationMs,
    });
  } catch (error) {
    res.status(500).json({
      message: 'A worker failed',
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});