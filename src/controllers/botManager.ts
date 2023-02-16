import { Bot } from '../models/bot-model';
import logger from '../utils/logger';
import { BotService } from '../services/bot-service';

export class BotManager {
    private static instance: BotManager;
    private bots: Bot[] = [];
    private botService: BotService;
    public constructor() {
        this.botService = new BotService();
        this.botService.getAllBots().then((bots) => {
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
        initBalance: number,
        isActive: boolean,
        userId: string
    ): Promise<Bot> {
        // TODO: check if user has enough cash, if not throw an error

        const bot = await this.botService.createBot(
            ticker,
            strategy,
            initBalance,
            initBalance,
            isActive,
            userId
        );

        this.bots.push(bot);
        return bot;
    }

    async startBot(botId: string): Promise<void> {
        const index = this.bots.findIndex((bot) => bot.id === botId);
        if (index === -1) {
            throw new Error('Bot not found.');
        }
        this.bots[index].isActive = true;
        logger.info(`Bot started: ${botId}`);
    }

    async stopBot(botId: string): Promise<void> {
        const index = this.bots.findIndex((bot) => bot.id === botId);
        if (index === -1) {
            throw new Error('Bot not found.');
        }
        this.bots[index].isActive = false;
        logger.info(`Bot stopped: ${botId}`);
    }

    async cashOutBot(botId: string): Promise<void> {
        const index = this.bots.findIndex((bot) => bot.id === botId);
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

    async getBotsByUser(userId: string): Promise<Bot[]> {
        return await this.botService.getAllBotsByUserId(userId);
    }

    async deleteBot(botId: string): Promise<void> {
        await this.botService.deleteBot(botId);
        this.bots.splice(this.bots.findIndex((bot) => bot.id === botId), 1);
    }

    // TODO: Update bot
}

export default new BotManager();
