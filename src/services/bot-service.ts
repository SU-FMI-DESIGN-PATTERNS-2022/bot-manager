import mongoose, { Model } from 'mongoose';
import { Bot } from '../models/bot-model';
import logger from '../utils/logger';

const BotSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true,
    },
    strategy: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    cash: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
});

const BotModel: Model<Bot> = mongoose.model('Bot', BotSchema);

export class BotService {
    constructor() {}

    async createBot(
        ticker: string,
        strategy: string,
        balance: number,
        isActive: boolean,
        cash: number,
        userId: string
    ): Promise<Bot> {
        const bot = await BotModel.create({
            ticker,
            strategy,
            balance,
            isActive,
            cash,
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
                balance: bot.balance,
                isActive: bot.isActive,
                cash: bot.cash,
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
