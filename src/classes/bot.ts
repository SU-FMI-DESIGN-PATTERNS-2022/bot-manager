import { IBot } from '../models/bot-model';
import logger from '../utils/logger';
import { SMABuySell, SMACrossover } from './strategy/strategy';

export class Bot implements IBot {
    id: string;
    ticker: string;
    isActive: boolean;
    strategy: string;
    currentBalance: number;
    initBalance: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;

    constructor(bot: IBot) {
        this.id = bot.id;
        this.userId = bot.userId;
        this.ticker = bot.ticker;
        this.isActive = bot.isActive;
        this.initBalance = bot.initBalance;
        this.createdAt = bot.createdAt;
        this.updatedAt = bot.updatedAt;
        this.currentBalance = bot.currentBalance;
        this.strategy = bot.strategy;
    }

    start(): void {
        this.isActive = true;
    }

    stop(): void {
        this.isActive = false;
    }

    cashOut(): number {
        if (this.currentBalance - this.initBalance < 0) {
            logger.error('Can\'t cash out, bot balance can\'t be negative');
            return 0;
        }
        const res = this.currentBalance - this.initBalance;
        this.currentBalance = this.initBalance;
        return res;
    }

    addCash(amount: number): void {
        this.currentBalance += amount;
    }

    changeCurrentBalance(amount: number): void {
        this.currentBalance = amount;
    }

    changeStrategy(strategy: string): void {
        this.strategy = strategy;
    }
// Command pattern
    executeStrategy(periods: number[]): void {
        switch (this.strategy) {
            case 'smaBuySell': new SMABuySell(periods).execute(this.id); break;
            case 'smaCrossover': new SMACrossover(periods).execute(this.id); break;
            default: throw new Error(`Unknown strategy`);
        }
    }
}
