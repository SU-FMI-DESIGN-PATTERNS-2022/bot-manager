import WebSocket from 'ws';
import logger from '../utils/logger';
import { ACCOUNT_SERVICE_API } from '../config/config';

export abstract class BaseClient {
    protected ws: WebSocket;

    constructor() {
        this.ws = new WebSocket(ACCOUNT_SERVICE_API);
    }

    private loadConfigWebSocket() {
        this.wsOpen();
        this.wsClose();
        this.wsError();
    }

    private wsOpen() {
        this.ws.on('open', function open() {
            logger.info('WebSocket connected');
        });
    }

    private wsClose() {
        this.ws.on('close', function close() {
            logger.info('WebSocket disconnected');
        });
    }

    private wsError() {
        this.ws.on('error', function error(err?: Error) {
            logger.error(err);
        });
    }
}
