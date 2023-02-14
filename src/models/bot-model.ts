import mongoose, { Model } from 'mongoose';

export interface Bot {
    id: string;
    ticker: string;
    strategy: string;
    currentBalance: number;
    initBalance: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

export const BotSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true,
    },
    strategy: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    cash: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
});

const BotModel: Model<Bot> = mongoose.model('Bot', BotSchema);

export default BotModel;
