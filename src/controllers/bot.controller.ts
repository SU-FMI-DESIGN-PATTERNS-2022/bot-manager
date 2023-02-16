import { NextFunction, Request, Response } from 'express';
import botManager from './botManager';

export const getAllBots = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await botManager.getAllBots()
        .then((bots) => {
            res.status(200).send({ data: bots });
        })
        .catch((err) => {
            next(err);
        });
};

export const getAllBotsForUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await botManager.getBotsByUser(req.params.userId)
        .then((bots) => {
            res.status(200).send({ data: bots });
        })
        .catch((err) => {
            next(err);
        });
};

export const getBotById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await botManager.getBotById(req.params.botId)
        .then((bot) => {
            res.status(200).send({ data: bot });
        })
        .catch((err) => {
            next(err);
        });
};

export const createBot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // eslint-disable-next-line max-len
    await botManager.createBot(req.body.ticker, req.body.strategy, req.body.initBalance, req.body.isActive, req.body.userId)
        .then((bot) => {
            res.status(200).send({ data: bot });
        })
        .catch((err) => {
            next(err);
        });
};

export const deleteBot = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    await botManager.deleteBot(req.params.botId)
        .then(() => {
            res.status(200).send({ data: 'The bot has been deleted successfully.' });
        })
        .catch((err) => {
            next(err);
        });
};

export const startBot = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    await botManager.startBot(req.params.botId)
        .then((bot) => {
            res.status(200).send({ data: 'The bot has been started successfully.' });
        })
        .catch((err) => {
            next(err);
        });
};


export const stopBot = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    await botManager.stopBot(req.params.botId)
        .then(() => {
            res.status(200).send({ data: 'The bot has been stopped successfully.' });
        })
        .catch((err) => {
            next(err);
        });
};
export const cashoutBot = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    await botManager.cashOutBot(req.params.botId)
        .then(() => {
            res.status(200).send({ data: 'The bot has been cashed out successfully.' });
        })
        .catch((err) => {
            next(err);
        });
};
