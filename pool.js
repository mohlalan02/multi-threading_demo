import Piscina from 'piscina';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const piscina = new Piscina({
  filename: resolve(__dirname, 'worker.js'),
  minThreads: 2,
  maxThreads: Math.max(4, Piscina.availableParallelism()),
  idleTimeout: 30_000,
  resourceLimits: {
    maxOldGenerationSizeMb: 80
  }
});

export async function hashWithPool(payload) {
  const message = await piscina.run({ payload });
  if (message?.status === 'ok') {
    return message.result;
  }
  throw new Error(message?.message || 'Worker failed');
}

export { piscina };