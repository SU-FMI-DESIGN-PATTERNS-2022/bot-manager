import { Strategy } from '../strategies/strategy'; // todo
import { PrismaClient } from '@prisma/client';
import { Bot } from '../models/bot-model';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export class BotService {
    constructor() {}

    async createBot(
        ticker: string,
        strategy: Strategy,
        balance: number,
        isActive: boolean,
        cash: number,
        userId: string)
        : Promise<Bot> {
        const bot = await prisma.bot.create({
            data: {
                ticker: ticker,
                strategy: strategy,
                balance: balance,
                isActive: isActive,
                cash: cash,
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        logger.info(`Bot created: ${bot.id}`);
        return bot;
    }

    async getBotById(id: string): Promise<Bot> {
        const bot = await prisma.bot.findUnique({
            where: {
                id: id
            }
        });

        if (bot === null) {
            throw new Error('Bot not found.');
        }

        logger.info(`Bot retrieved: ${id}`);
        return bot;
    }

    async getAllBots(): Promise<Bot[]> {
        const bots = await prisma.bot.findMany();

        logger.info(`All bots retrieved.`);
        return bots;
    }

    async getAllBotsByUserId(userId: string): Promise<Bot[]> {
        const bots = await prisma.bot.findMany({
            where: {
                userId: userId
            }
        });

        logger.info(`All bots retrieved for user: ${userId}`);
        return bots;
    }

    async updateBot(id: string, bot: Bot): Promise<Bot> {
        const updatedBot = await prisma.bot.update({
            where: {
                id: id
            },
            data: {
                ticker: bot.ticker,
                strategy: bot.strategy,
                balance: bot.balance,
                isActive: bot.isActive,
                cash: bot.cash,
                userId: bot.userId,
                createdAt: bot.createdAt,
                updatedAt: new Date()
            }
        });

        logger.info(`Bot updated: ${id}`);
        return updatedBot;
    }

    async deleteBot(id: string): Promise<void> {
        const targetBot = await prisma.bot.findUnique({
            where: {
                id: id
            }
        });

        if (targetBot === null) {
            throw new Error('Bot not found.');
        }

        if (targetBot.isActive) {
            throw new Error('Bot is active. Cannot delete.');
        }

        await prisma.bot.delete({
            where: {
                id: id
            }
        });

        // TODO: transfer all money to the user's cash

        logger.info(`Bot deleted: ${id}`);
    }

    async deleteBotByTicker(ticker: string): Promise<void> {
        const targetBot = await prisma.bot.findUnique({
            where: {
                ticker: ticker
            }
        });

        if (targetBot === null) {
            throw new Error('Bot not found.');
        }

        if (targetBot.isActive) {
            throw new Error('Bot is active. Cannot delete.');
        }

        // TODO: transfer all money to the user's cash

        await prisma.bot.delete({
            where: {
                ticker: ticker
            }
        });

        logger.info(`Bot deleted: ${ticker}`);
    }

    async deleteAllBots(): Promise<void> {
        await prisma.bot.deleteMany();

        logger.info('All bots deleted.');
    }
}
