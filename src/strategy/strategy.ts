class Token {
    symbol: string;
    barHigh: number;
    barLow: number;
    barOpen: number;
    barClose: number;
}

function getResponseObject(response: string) {
    return JSON.parse(response);
}

function getTokenArray(responseObject) : Token[] {
    return responseObject.data;
}

function averageLastNDays(n: number) : number {
    var response = "";

    var responseObject = getResponseObject(response);
    var tokenArray = getTokenArray(responseObject);
    
    var closingPrices : number[] = [];

    for (let i = 0; i < tokenArray.length; i++) {
        var token = tokenArray[i];
        var price = token.barClose;

        closingPrices.push(price);
    }
    
    var sum = 0;

    for(let i=0;i<closingPrices.length;i++) {
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
        this.name = "sma buy sell";
        this.periods = periods;
    }

    execute(periods: number[]): void {
        const period = periods[0];
        var avg = averageLastNDays(period);
        var currClosingPrice = 0;

        if(avg > currClosingPrice) {
            // buy signal
        }
        else if(avg < currClosingPrice) {
            // sell signal
        }
    }
}

class SMACrossover implements Strategy {
    name: string;
    periods: number[];

    constructor(periods: number[]) {
        this.name = "sma crossover";
        this.periods = periods;
    }

    execute(periods: number[]): void {
        const period1 = periods[0];
        const period2 = periods[1];

        var avg1 = averageLastNDays(period1);
        var avg2 = averageLastNDays(period2);
        
        var prevAvg1 = 0;
        var prevAvg2 = 0;

        if(prevAvg1 < prevAvg2 && avg1 > avg2) {
            // buy signal
        }
        else if(prevAvg2 < prevAvg1 && avg2 > avg1) {
            // sell signal
        }
    }
}

class Bot {
    name: string
    userID: string
    ticker: string
    isActive: boolean
    balance: number
    strategy: Strategy

    constructor(name: string,userID: string,ticker: string,strategy: Strategy,balance: number = 0) {
        this.name = name;
        this.userID = userID;
        this.ticker = ticker;
        this.balance = balance;
        this.strategy = strategy;

        this.isActive = false;
    }

    start() {
        this.isActive = true;
    }

    stop() {
        this.isActive = false;
    }

    cashOut(amount: number) {
        if (this.balance - amount < 0) {
            console.error("Can't cash out, bot balance can't be negative");
            return;
        }

        // add balance to users account before/after this

        this.balance -= amount;
    }

    addCash(amount: number) {
        this.balance += amount;
    }

    changeStrategy(strategy: Strategy) {
        this.strategy = strategy;
    }

    executeStrategy(periods: number[]) {
        this.strategy.execute(periods);
    }
}