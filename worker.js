import { parentPort, workerData } from 'node:worker_threads';

let result = 0;

const countPerWorker = workerData.totalCount / workerData.threadCount;

for (let i = 0; i < countPerWorker; i++) {
  result++;
}

parentPort.postMessage(result);