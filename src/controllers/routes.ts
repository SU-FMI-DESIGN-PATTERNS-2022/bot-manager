import express from 'express';
import { getInfo } from './controllers/info';
import logger from './utils/logger';

// eslint-disable-next-line new-cap
const routes = express.Router();

// Healthcheck endpoint
routes.get('', function (req: express.Request, res: express.Response) {
  logger.info(`Health-check probe/readiness: ${Date.now()}`);
  res.status(200).send('OK');
});

routes.get('/info', getInfo);

export default routes;
