import { Bot } from '../models/bot-model';
import logger from '../utils/logger';
import { BotService } from '../services/bot-service';

export class BotManager {
    private static instance: BotManager;
    private bots: Bot[] = [];

    private constructor() {
        const botService = new BotService();
        botService.getAllBots().then((bots) => {
            this.bots = bots;
        });
    }

    static getInstance(): BotManager {
        if (!BotManager.instance) {
            BotManager.instance = new BotManager();
        }
        return BotManager.instance;
    }

    async createBot(
        ticker: string,
        strategy: string,
        balance: number,
        isActive: boolean,
        userId: string
    ): Promise<Bot> {
        // TODO: check if user has enough cash, if not throw an error

        const botService = new BotService();
        const bot = await botService.createBot(
            ticker,
            strategy,
            balance,
            isActive,
            0,
            userId
        );

        this.bots.push(bot);
        return bot;
    }

    async startBot(bot: Bot): Promise<void> {
        const index = this.bots.indexOf(bot);
        if (index === -1) {
            throw new Error('Bot not found.');
        }
        this.bots[index].isActive = true;
        logger.info(`Bot started: ${bot.id}`);
    }

    async stopBot(bot: Bot): Promise<void> {
        const index = this.bots.indexOf(bot);
        if (index === -1) {
            throw new Error('Bot not found.');
        }
        this.bots[index].isActive = false;
        logger.info(`Bot stopped: ${bot.id}`);
    }

    async cashOutBot(bot: Bot): Promise<void> {
        const index = this.bots.indexOf(bot);
        if (index === -1) {
            throw new Error('Bot not found.');
        }

        // todo: add the money to the user's balance
    }

    async getAllBots(): Promise<Bot[]> {
        return this.bots;
    }

    async getBotByTicker(ticker: string): Promise<Bot> {
        const bot = this.bots.find((bot) => bot.ticker === ticker);
        if (bot === undefined) {
            throw new Error('Bot not found.');
        }
        return bot;
    }

    async getBotById(id: string): Promise<Bot> {
        const bot = this.bots.find((bot) => bot.id === id);
        if (bot === undefined) {
            throw new Error('Bot not found.');
        }
        return bot;
    }

    // TODO: Update bot
}
