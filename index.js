import express from 'express';
import { WorkerPool } from './worker-pool.js';

const app = express();
const port = process.env.PORT || 3000;

const WORKER_COUNT = 4;
const TOTAL_COUNT = 10_000_000_000;

const MAX_QUEUE_SIZE = 8;

const pool = new WorkerPool(WORKER_COUNT, MAX_QUEUE_SIZE);

app.get('/non-blocking', (req, res) => {
  res.status(200).send('This page is non-blocking.');
});

app.get('/blocking', async (req, res) => {
  const startedAt = Date.now();

  try {
    const countPerWorker = TOTAL_COUNT / WORKER_COUNT;

    const tasks = [];

    for (let i = 0; i < WORKER_COUNT; i++) {
      tasks.push(
        pool.runTask({
          countTo: countPerWorker,
        })
      );
    }

    const results = await Promise.all(tasks);
    const total = results.reduce((sum, result) => sum + result, 0);
    const taskDurationMs = Date.now() - startedAt;

    res.status(200).json({
      message: 'Task completed using a worker pool',
      workersInPool: WORKER_COUNT,
      result: total,
      taskDurationMs,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Task failed',
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});