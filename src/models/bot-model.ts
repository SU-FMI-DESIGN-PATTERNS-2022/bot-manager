export interface Bot {
    id: string;
    ticker: string;
    strategy: string;
    balance: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    cash: number;
    userId: string;
}
