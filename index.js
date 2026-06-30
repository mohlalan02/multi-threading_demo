import express from 'express';
import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const app = express();
app.use(express.json({ limit: '1mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workerPath = join(__dirname, 'worker.js');

app.get('/non-blocking/', (req, res) => {
  res.status(200).send('This page is non-blocking');
});

app.post('/api/pool/hash', async (req, res, next) => {
  try {
    const hash = await hashWithPool(req.body.text);
    res.json({ hash });
  } catch (error) {
    next(error);
  }
});

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const worker = new Worker(workerPath, {
      workerData,
      resourceLimits: {
        maxOldGenerationSizeMb: 64,
        maxYoungGenerationSizeMb: 16,
        stackSizeMb: 4
      }
    });

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      worker.terminate();
      reject(new Error('Worker timeout'));
    }, 10_000);

    function safeResolve(value) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      worker.terminate();
      resolve(value);
    }

    function safeReject(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      worker.terminate();
      reject(error);
    }

    worker.once('message', (message) => {
      if (message.status === 'ok') {
        safeResolve(message.result);
      } else {
        safeReject(new Error(message.message));
      }
    });

    worker.once('error', (error) => {
      safeReject(error);
    });

    worker.once('exit', (code) => {
      if (code !== 0) {
        safeReject(new Error(`Worker exited with code ${code}`));
      }
    });
  });
}

app.use((error, req, res, _next) => {
  res.status(500).json({ error: error.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});