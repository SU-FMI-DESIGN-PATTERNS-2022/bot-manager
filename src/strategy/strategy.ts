interface Token {
    symbol: string;
    barHigh: number;
    barLow: number;
    barOpen: number;
    barClose: number;
}

/**
 * @param response
 */
function getResponseObject(response: string): any {
    return JSON.parse(response);
}

/**
 * @param responseObject
 */
function getTokenArray(responseObject: any) : any[] {
    return responseObject.data;
}

/**
 * @param n
 */
function averageLastNDays(n: number) : number {
    const response = '';

    const responseObject = getResponseObject(response);
    const tokenArray = getTokenArray(responseObject);

    const closingPrices : number[] = [];

    for (let i = 0; i < tokenArray.length; i++) {
        const token = tokenArray[i];
        const price = token.barClose;

        closingPrices.push(price);
    }

    let sum = 0;

    for (let i=0; i<closingPrices.length; i++) {
        sum += closingPrices[i];
    }

    return sum / n;
}

interface Strategy {
    name: string;
    periods: number[]; // in days

    execute(periods: number[]): void;
}

class SMABuySell implements Strategy {
    name: string;
    periods: number[];

    constructor(periods: number[]) {
        this.name = 'sma buy sell';
        this.periods = periods;
    }

    execute(periods: number[]): void {
        const period = periods[0];
        const avg = averageLastNDays(period);
        const currClosingPrice = 0;

        if (avg > currClosingPrice) {
            // buy signal
        } else if (avg < currClosingPrice) {
            // sell signal
        }
    }
}

class SMACrossover implements Strategy {
    name: string;
    periods: number[];

    constructor(periods: number[]) {
        this.name = 'sma crossover';
        this.periods = periods;
    }

    execute(periods: number[]): void {
        const period1 = periods[0];
        const period2 = periods[1];

        const avg1 = averageLastNDays(period1);
        const avg2 = averageLastNDays(period2);

        const prevAvg1 = 0;
        const prevAvg2 = 0;

        if (prevAvg1 < prevAvg2 && avg1 > avg2) {
            // buy signal
        } else if (prevAvg2 < prevAvg1 && avg2 > avg1) {
            // sell signal
        }
    }
}

class Bot {
    name: string;
    userID: string;
    ticker: string;
    isActive: boolean;
    balance: number;
    strategy: Strategy;

    constructor(name: string, userID: string, ticker: string, strategy: Strategy, balance: number = 0) {
        this.name = name;
        this.userID = userID;
        this.ticker = ticker;
        this.balance = balance;
        this.strategy = strategy;

        this.isActive = false;
    }

    start(): void {
        this.isActive = true;
    }

    stop(): void {
        this.isActive = false;
    }

    cashOut(amount: number): void {
        if (this.balance - amount < 0) {
            console.error('Can\'t cash out, bot balance can\'t be negative');
            return;
        }

        // add balance to users account before/after this

        this.balance -= amount;
    }

    addCash(amount: number): void {
        this.balance += amount;
    }

    changeStrategy(strategy: Strategy): void {
        this.strategy = strategy;
    }

    executeStrategy(periods: number[]): void {
        this.strategy.execute(periods);
    }
}
