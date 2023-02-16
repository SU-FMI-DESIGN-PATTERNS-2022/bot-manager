
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

// Abstract factory - one abstract class with different children
export interface Strategy {
    name: string;
    periods: number[]; // in days

    execute(botId: string): void;
}

export class SMABuySell implements Strategy {
    name: string;
    periods: number[];

    constructor(periods: number[]) {
        this.name = 'sma buy sell';
        this.periods = periods;
    }

    execute(botId: string): void {
        const period = this.periods[0];
        const avg = averageLastNDays(period);
        const currClosingPrice = 0;

        if (avg > currClosingPrice) {
            // buy signal with the botId
        } else if (avg < currClosingPrice) {
            // sell signal with the botId
        }
    }
}

export class SMACrossover implements Strategy {
    name: string;
    periods: number[];

    constructor(periods: number[]) {
        this.name = 'sma crossover';
        this.periods = periods;
    }

    execute(botId: string): void {
        const period1 = this.periods[0];
        const period2 = this.periods[1];

        const avg1 = averageLastNDays(period1);
        const avg2 = averageLastNDays(period2);

        const prevAvg1 = 0;
        const prevAvg2 = 0;

        if (prevAvg1 < prevAvg2 && avg1 > avg2) {
            // buy signal with the botId
        } else if (prevAvg2 < prevAvg1 && avg2 > avg1) {
            // sell signal with the botId
        }
    }
}


