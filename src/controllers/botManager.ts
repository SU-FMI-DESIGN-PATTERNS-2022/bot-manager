import logger from '../utils/logger';
import { BotService } from '../services/bot-service';
import { IBot } from '../models/bot-model';
import { Bot } from '../classes/bot';

// TODO create observer

// Mediator / Proxy / Singleton
export class BotManager {
    private static instance: BotManager;
    private bots: Bot[] = [];
    private botService: BotService;
    public constructor() {
        this.botService = new BotService();
        this.botService.getAllBots().then((bots) => {
            for (const bot of bots) {
                if (bot.isActive) {
                    this.bots.push(new Bot(bot));
                }
            }
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
    ): Promise<IBot> {
        // TODO: check if user has enough cash, if not throw an error

        const bot = await this.botService.createBot(
            ticker,
            strategy,
            initBalance,
            initBalance,
            isActive,
            userId
        );

        this.bots.push(new Bot(bot));

        return bot;
    }

    async startBot(botId: string): Promise<void> {
        const index = this.bots.findIndex((bot) => bot.id === botId);
        if (index === -1) {
            throw new Error('Bot not found.');
        }
        this.bots[index].start();
        this.botService.updateBot(this.bots[index].id, this.bots[index]);

        logger.info(`Bot started: ${botId}`);
    }

    async stopBot(botId: string): Promise<void> {
        const index = this.bots.findIndex((bot) => bot.id === botId);
        if (index === -1) {
            throw new Error('Bot not found.');
        }
        this.bots[index].stop();
        this.botService.updateBot(this.bots[index].id, this.bots[index]);
        logger.info(`Bot stopped: ${botId}`);
    }

    async changeBotBalance(botId: string, newBalance: number): Promise<void> {
        const index = this.bots.findIndex((bot) => bot.id === botId);
        if (index === -1) {
            throw new Error('Bot not found.');
        }
        this.bots[index].changeCurrentBalance(newBalance);
        this.botService.updateBot(this.bots[index].id, this.bots[index]);
    }

    async cashOutBot(botId: string): Promise<void> {
        const index = this.bots.findIndex((bot) => bot.id === botId);
        if (index === -1) {
            throw new Error('Bot not found.');
        }
        const res = this.bots[index].cashOut();
        this.botService.updateBot(this.bots[index].id, this.bots[index]);
        if (res > 0) {
        // todo: add res to the user's balance
        }
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

    async getBotsByUser(userId: string): Promise<IBot[]> {
        return await this.botService.getAllBotsByUserId(userId);
    }

    async deleteBot(botId: string): Promise<void> {
        await this.botService.deleteBot(botId);
        this.bots.splice(this.bots.findIndex((bot) => bot.id === botId), 1);
    }
}

export default new BotManager();
