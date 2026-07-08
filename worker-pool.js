import { Worker } from 'node:worker_threads';

export class WorkerPool {
  constructor(size) {
    this.workers = [];
    this.freeWorkers = [];
    this.taskQueue = [];

    for (let i = 0; i < size; i++) {
      const worker = new Worker(new URL('./worker.js', import.meta.url));

      worker.on('message', (result) => {
        worker.currentTask.resolve(result);
        worker.currentTask = null;
        this.freeWorkers.push(worker);
        this.runNextTask();
      });

      worker.on('error', (error) => {
        if (worker.currentTask) {
          worker.currentTask.reject(error);
          worker.currentTask = null;
        }
      });

      this.workers.push(worker);
      this.freeWorkers.push(worker);
    }
  }

  runTask(data) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ data, resolve, reject });
      this.runNextTask();
    });
  }

  runNextTask() {
    if (this.freeWorkers.length === 0) {
      return;
    }

    if (this.taskQueue.length === 0) {
      return;
    }

    const worker = this.freeWorkers.pop();
    const task = this.taskQueue.shift();

    worker.currentTask = task;
    worker.postMessage(task.data);
  }
}