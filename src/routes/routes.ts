import express from 'express';
// eslint-disable-next-line max-len
import { cashoutBot, createBot, deleteBot, getAllBots, getAllBotsForUser, getBotById, startBot, stopBot } from '../controllers/bot.controller';
import { getInfo } from '../controllers/info';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/role';
import { validate } from '../middlewares/validate';
import logger from '../utils/logger';
import { botValidation } from '../validations/bot';

// eslint-disable-next-line new-cap
const routes = express.Router();

// Healthcheck endpoint
routes.get('', function (req: express.Request, res: express.Response) {
  logger.info(`Health-check probe/readiness: ${Date.now()}`);
  res.status(200).send('OK');
});

routes.get('/info', getInfo);

// Chain of responsibility / Facade
routes.get('/bots/', authenticate, isAdmin, getAllBots); // For ADMIN
routes.get('/bots/:userId', authenticate, getAllBotsForUser);
routes.get('/bots/:botId', authenticate, getBotById);
routes.post('/bots/create', authenticate, botValidation, validate, createBot);
routes.delete('/bots/:botId', authenticate, deleteBot);
routes.get('/bots/:botId/start', authenticate, startBot);
routes.get('/bots/:botId/stop', authenticate, stopBot);
routes.get('/bots/:botId/cash-out', authenticate, cashoutBot);

export default routes;
