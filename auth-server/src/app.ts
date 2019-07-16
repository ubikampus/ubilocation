import express, { Request, Response } from 'express';
require('dotenv').config()
const bodyParser = require('body-parser');
const loginRouter = require('./controllers/login');

const app = express();

app.use(bodyParser.json());
app.use('/login', loginRouter);

app.get('/sign', (req, res) => {
  res.send('<h1>Gonna sign</h1>');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Listening at', PORT);
});
