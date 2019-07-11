import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Hello from auth</h1>');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Listening at', PORT);
});
