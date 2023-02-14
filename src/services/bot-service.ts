import BotModel, { Bot } from '../models/bot-model';
import logger from '../utils/logger';

export class BotService {
    constructor() {}

    async createBot(
        ticker: string,
        strategy: string,
        initBalance: number,
        currentBalance: number,
        isActive: boolean,
        userId: string
    ): Promise<Bot> {
        const bot = await BotModel.create({
            ticker,
            strategy,
            initBalance,
            currentBalance,
            isActive,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        logger.info(`Bot created: ${bot._id}`);
        return bot;
    }

    async getBotById(id: string): Promise<Bot> {
        const bot = await BotModel.findById(id);

        if (!bot) {
            throw new Error('Bot not found.');
        }

        logger.info(`Bot retrieved: ${id}`);
        return bot;
    }

    async getAllBots(): Promise<Bot[]> {
        const bots = await BotModel.find();

        logger.info(`All bots retrieved.`);
        return bots;
    }

    async getAllBotsByUserId(userId: string): Promise<Bot[]> {
        const bots = await BotModel.find({ userId });

        logger.info(`All bots retrieved for user: ${userId}`);
        return bots;
    }

    async updateBot(id: string, bot: Bot): Promise<Bot> {
        const updatedBot = await BotModel.findByIdAndUpdate(
            id,
            {
                ticker: bot.ticker,
                strategy: bot.strategy,
                initBalance: bot.initBalance,
                currentBalance: bot.currentBalance,
                isActive: bot.isActive,
                userId: bot.userId,
                createdAt: bot.createdAt,
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!updatedBot) {
            throw new Error('Bot not found.');
        }

        logger.info(`Bot updated: ${id}`);
        return updatedBot;
    }

    async deleteBot(id: string): Promise<void> {
        const targetBot = await BotModel.findById(id);

        if (!targetBot) {
            throw new Error('Bot not found.');
        }

        if (targetBot.isActive) {
            throw new Error('Bot is active. Cannot delete.');
        }

        // TODO: transfer all money to the user's cash

        await targetBot.remove();

        logger.info(`Bot deleted: ${id}`);
    }

    async deleteBotByTicker(ticker: string): Promise<void> {
        const targetBot = await BotModel.findOne({ ticker });

        if (!targetBot) {
            throw new Error('Bot not found.');
        }

        if (targetBot.isActive) {
            throw new Error('Bot is active. Cannot delete.');
        }

        // TODO: transfer all money to the user's cash

        await targetBot.remove();

        logger.info(`Bot deleted: ${ticker}`);
    }

    async deleteAllBots(): Promise<void> {
        await BotModel.deleteMany();

        logger.info('All bots deleted.');
    }
}
