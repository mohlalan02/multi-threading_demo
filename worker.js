import { parentPort } from 'node:worker_threads';

parentPort.on('message', (task) => {
  let result = 0;

  for (let i = 0; i < task.countTo; i++) {
    result++;
  }

  parentPort.postMessage(result);
});