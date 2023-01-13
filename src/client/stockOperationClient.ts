import logger from '../utils/logger';
import { BaseClient } from './baseClient';

class StockOperationClient extends BaseClient {
    constructor () {
        super();
    }

    public buyStock(stockSymbol: string, shares: number, price: number) {
        const data = {
            type: 'buy',
            symbol: stockSymbol,
            shares: shares,
            price: price
        };
        this.ws.send(JSON.stringify(data), (err?: Error) => {
            if (err) {
                logger.error(`Error sending buy request for ${shares} shares of ${stockSymbol} at ${price}: ${err}`);
            } else {
                logger.info(`Successfully sent buy request for ${shares} shares of ${stockSymbol} at ${price}`);
            }
        });
    }

    public sellStock (stockSymbol: string, shares: number, price: number) {
        const data = {
            type: 'sell',
            symbol: stockSymbol,
            shares: shares,
            price: price
        };
        this.ws.send(JSON.stringify(data), (err?: Error) => {
            if (err) {
                logger.error(`Error sending sell request for ${shares} shares of ${stockSymbol} at ${price}: ${err}`);
            } else {
                logger.info(`Successfully sent sell request for ${shares} shares of ${stockSymbol} at ${price}`);
            }
        });
    }
}

export const stockOperationClient = new StockOperationClient();
