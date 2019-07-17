import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');

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

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
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

module.exports = loginCheck;
