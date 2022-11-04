import { Request, Response, NextFunction } from 'express';

import logger from '../utils/logger';

import HttpException from '../classes/HttpException';

/**
 * @param err An error to be handled
 * @param _req Express request
 * @param res Express response
 * @param _next Function to be invoked after this one
 */
function errorHandler(err: HttpException, _req: Request, res: Response, _next: NextFunction): void {
  const status = err.status || 500;
  let message = err.message || 'Something went wrong';

  if (status === 500) {
    message = 'Something went wrong';
  }

  res.status(status).json({ error: message });
  logger.error({ message: err.message, status: err.status, stack: err.stack });
}

export default errorHandler;
