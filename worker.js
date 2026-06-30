import { parentPort, workerData } from 'node:worker_threads';
import { createHash } from 'node:crypto';

try {
  const result = hashBuffer(workerData.payload);
  parentPort.postMessage({ status: 'ok', result });
} catch (error) {
  parentPort.postMessage({ status: 'error', message: error.message });
}

function hashBuffer(payload) {
  const hash = createHash('sha256');
  hash.update(payload, 'utf8');
  return hash.digest('hex');
}