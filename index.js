import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/non-blocking', (req, res) => {
  res.status(200).send('This route is responsive when the event loop is free.');
});

app.get('/blocking', (req, res) => {
  const startedAt = Date.now();
  let result = 0;

  for (let i = 0; i < 10_000_000_000; i++) {
    result++;
  }

  const durationMs = Date.now() - startedAt;

  res.status(200).json({
    message: 'CPU-bound task completed on the main thread',
    result,
    durationMs,
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});