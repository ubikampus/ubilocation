import express, { Request, Response } from 'express';

const app = express();

app.get('/sign', (req, res) => {
  res.send('<h1>Gonna sign</h1>');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Listening at', PORT);
});
