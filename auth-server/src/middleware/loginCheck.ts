import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const getTokenFrom = (req: Request) => {
  const authorization = req.get('authorization');
  if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
    return null;
  }

  return authorization.substring(7);
};

const loginCheck = (req: Request, res: Response, next: () => void) => {
  if (req.path === '/login') {
    return next();
  }

  const token = getTokenFrom(req);
  if (!token) {
    return res.status(401).json({ error: 'token missing' });
  }

  if (!process.env.SECRET) {
    return res
      .status(500)
      .json({ error: 'secret is undefined (set it in your .env file)' });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET) as any;
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

export default loginCheck;
