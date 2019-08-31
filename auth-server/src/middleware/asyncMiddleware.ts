/**
 * Workaround for missing promise support in express 4.
 *
 * See https://github.com/expressjs/express/pull/2237
 *
 * https://nemethgergely.com/error-handling-express-async-await/
 */

import { RequestHandler } from 'express';

export const asyncMiddleware: (
  a: RequestHandler
) => RequestHandler = middleware => (req, res, next) => {
  Promise.resolve(middleware(req, res, next)).catch(error => {
    next(error);
  });
};
