import { Strategy } from '../strategies/strategy'; // todo
import { PrismaClient } from '@prisma/client';
import { Bot } from '../models/bot'; // todo

const prisma = new PrismaClient();

export class BotModel {
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
        return bot;
    }

    async getBotById(id: string): Promise<Bot> {
        const bot = await prisma.bot.findUnique({
            where: {
                id: id
            }
        });
        return bot;
    }

    async getAllBots(): Promise<Bot[]> {
        const bots = await prisma.bot.findMany();
        return bots;
    }

    async getAllBotsByUserId(userId: string): Promise<Bot[]> {
        const bots = await prisma.bot.findMany({
            where: {
                userId: userId
            }
        });
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
        return updatedBot;
    }

    async deleteBot(id: string): Promise<Bot> {
        const deletedBot = await prisma.bot.delete({
            where: {
                id: id
            }
        });
        return deletedBot;
    }

    async deleteAllBots(): Promise<void> {
        const deletedBots = await prisma.bot.deleteMany();
        return;
    }

    async deleteAllBotsByUserId(userId: string): Promise<void> {
        const deletedBots = await prisma.bot.deleteMany({
            where: {
                userId: userId
            }
        });
        return;
    }

    async deleteAllBotsByTicker(ticker: string): Promise<void> {
        const deletedBots = await prisma.bot.deleteMany({
            where: {
                ticker: ticker
            }
        });
        return;
    }

    async deleteAllBotsByStrategy(strategy: Strategy): Promise<void> {
        const deletedBots = await prisma.bot.deleteMany({
            where: {
                strategy: strategy
            }
        });
        return;
    }
}
