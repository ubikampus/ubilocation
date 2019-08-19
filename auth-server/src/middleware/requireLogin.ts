import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

if (!process.env.SECRET) {
  throw new Error('SECRET env variable cannot be empty');
}

const { SECRET } = process.env;

const getTokenFrom = (req: Request) => {
  const authorization = req.get('authorization');
  if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
    return null;
  }

  return authorization.substring(7);
};

const requireLogin = (req: Request, res: Response, next: () => void) => {
  const token = getTokenFrom(req);
  if (!token) {
    return res.status(401).json({ error: 'token missing' });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET) as any;
  } catch (exception) {
    return res.status(401).json({ error: 'invalid token' });
  }

  if (!decodedToken.username) {
    return res.status(401).json({ error: 'invalid token' });
  }

  if (decodedToken.username !== 'admin') {
    return res.status(401).json({ error: 'access denied' });
  }

  next();
};

export default requireLogin;
