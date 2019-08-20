import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import express from 'express';
const loginRouter = express.Router();

// TODO: make these configurable by env variables
const adminUsername = 'admin';
const adminPassword = '#Apollo11';

export interface Admin {
  token: string;
  username: string;
}

if (!process.env.SECRET) {
  throw new Error('SECRET env variable cannot be empty');
}

const { SECRET } = process.env;

loginRouter.post('/', (request: Request, response: Response) => {
  const body = request.body;

  if (body.username !== adminUsername || body.password !== adminPassword) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    username: body.username,
  };

  const token = jwt.sign(userForToken, SECRET);

  response.status(200).send({ token, username: body.username } as Admin);
});

export default loginRouter;
