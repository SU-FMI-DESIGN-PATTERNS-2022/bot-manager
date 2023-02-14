import express, { Express } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import mongoose from './services/database-service';

import errorHandler from './middlewares/errorHandler';

import router from './routes/routes';

import logger from './utils/logger';

import { PORT } from './config/config';

dotenv.config();
const app = express();

mongoose.connectToDatabase(() => afterConnect(app), false);


app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);

let server: http.Server | undefined;

app.listen(PORT, () => logger.info(`Server is listening on port: ${PORT}`));


process.on('SIGTERM', () => {
  if (server) {
    server.close(() => {
      logger.info('The server has been stopped.');
    });
  }
});

process.on('ready', () => {

});

/**
 * Function to be executed after successful connection
 *
 * @param app The Express app
 */
async function afterConnect(app: Express): Promise<void> {
  app.emit('ready');
}
