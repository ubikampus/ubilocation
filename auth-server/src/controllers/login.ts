import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import express from 'express';
const loginRouter = express.Router();

const adminUsername = 'admin';
const adminPassword = '#Apollo11';

loginRouter.post('/', (request: Request, response: Response) => {
  const body = request.body;

  if (body.username !== adminUsername || body.password !== adminPassword) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    username: body.username,
  };

  if (!process.env.SECRET) {
    return response
      .status(500)
      .json({ error: 'secret is undefined (set it in your .env file)' });
  }

  const token = jwt.sign(userForToken, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: body.username })
});

export default loginRouter;
