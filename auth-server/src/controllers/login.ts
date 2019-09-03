import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import express from 'express';
import { timingSafeEqual } from 'crypto';

import { appConfig } from '../validation';
import { asyncMiddleware } from '../middleware/asyncMiddleware';

const loginRouter = express.Router();

export interface Admin {
  token: string;
  username: string;
}

loginRouter.post(
  '/',
  asyncMiddleware(async (request: Request, response: Response) => {
    const body = request.body;

    const err = { error: 'invalid username or password' };

    if (body.password.length !== appConfig.ADMIN_PASSWORD.length) {
      await response.status(401).json(err);
      return;
    }

    const isCorrectPassword = timingSafeEqual(
      Buffer.from(body.password),
      Buffer.from(appConfig.ADMIN_PASSWORD)
    );

    if (body.username !== appConfig.ADMIN_USER || !isCorrectPassword) {
      await response.status(401).json(err);
      return;
    }

    const tokenContents = { username: body.username };
    const token = jwt.sign(tokenContents, appConfig.JWT_SECRET);

    await response
      .status(200)
      .send({ token, username: body.username } as Admin);
  })
);

export default loginRouter;
