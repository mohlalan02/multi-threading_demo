import express from 'express';

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

  let result = 0;

  for (let i = 0; i < 10_000_000_000; i++) {
    result++;
  }

  const durationMs = Date.now() - startedAt;

  res.status(200).json({
    message: 'Task completed without worker',
    result,
    durationMs,
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});