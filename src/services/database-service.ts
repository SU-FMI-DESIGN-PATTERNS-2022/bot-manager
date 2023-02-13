import mongoose from 'mongoose';

import logger from './../utils/logger';

const mongodbPort = process.env.MONGODB_PORT || '27017';
const dbName = process.env.MONGODB_NAME || 'Trading';
const mongodbHost = process.env.MONGODB_FQDN || 'localhost';
const mongodbUser = process.env.MONGODB_USER;
const mongodbPass = process.env.MONGODB_PASS;
const qopts = '';

const mongoUri = mongodbUser && mongodbPass
    ? `mongodb+srv://${mongodbUser}:${mongodbPass}@${mongodbHost}/${dbName}${qopts}`
    : `mongodb://${mongodbHost}:${mongodbPort}/${dbName}`;

/**
 * @summary Connects the app to the DB Server
 * @description Stops the app on error and starts the server on success
 * @param callbackFunc The Express app
 * @param disconnect Disconnect the db after executing the callback function
 */
export async function connectToDatabase(callbackFunc: () => Promise<void>, disconnect: boolean) : Promise<void> {
    mongoose.connect(mongoUri, (err) => {
        if (err) {
            console.log(err);
        }
    });

    const db = mongoose.connection;

    db.on('error', () => {
        console.error.bind(console, 'connection error:');
        process.kill(process.pid, 'SIGTERM');
    });

    db.once('open', async () => {
        logger.info(`DB ${dbName} connected successfully.`);

        await callbackFunc();

        if (disconnect) {
            db.close().catch((err) => {
                logger.error(err);
            });
            logger.info('DB disconnected.');
        }
    });
}

export default { connectToDatabase };
