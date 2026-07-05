import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/non-blocking', (req, res) => {
  res.status(200).send('This page is non-blocking.');
});

app.get('/blocking', (req, res) => {
  let result = 0;

  for (let i = 0; i < 10_000_000_000; i++) {
    result++;
  }

  res.status(200).send(`Result is ${result}`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});