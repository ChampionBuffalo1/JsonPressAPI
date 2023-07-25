import mongoose from 'mongoose';
import Logger from './Logger';

let retryCount = 0,
  mongoConnected = false;
const maxRetries = 5,
  MINUTE = 1000 * 60,
  defaultDelay = 5000; // 5s

const createMongoConnection = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!mongoConnected) {
      const dbOptions: mongoose.ConnectOptions = {
        family: 4,
        maxPoolSize: 100,
        retryWrites: true,
        connectTimeoutMS: 30000
      };
      mongoose
        .set('strictQuery', true)
        .connect(process.env.MONGO_URL, dbOptions)
        .then(() => {
          retryCount = 0;
          mongoConnected = true;
          resolve();
        })
        .catch(err => {
          retryCount++;
          Logger.error((err as Error).toString());
          Logger.debug(`MongoDB connection failure count: ${retryCount}`);
          if (retryCount > maxRetries) reject('Maximum mongo re-connect tries exceeded.');
          setTimeout(createMongoConnection, defaultDelay);
        });

      mongoose.connection.on('connected', () => Logger.info('MongoDB connected successfully.'));
      mongoose.connection.on('error', err => {
        mongoConnected = false;
        const retryTime = MINUTE * 2;

        setTimeout(createMongoConnection, retryTime);
        Logger.error(`MongoDB connection lost.\n${err}`);
        Logger.info(`Re-connecting to MongoDB in ${retryTime / MINUTE} minutes.`);
      });
    } else {
      resolve();
    }
  });

export { createMongoConnection };
