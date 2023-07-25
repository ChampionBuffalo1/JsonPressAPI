import cors from 'cors';
import express from 'express';
import apiRouter from './api';
import Logger from './lib/Logger';
import { config } from 'dotenv-safe';
import passport from './lib/passport';
import { createMongoConnection } from './lib/connect';

(async () => {
  config();
  const app = express();
  app.use(cors(), express.json(), express.urlencoded({ extended: true }));
  await createMongoConnection();

  app.use(passport.initialize());
  app.use('/api', apiRouter);

  app.get('/', (_, res) => {
    res.send('Hello World!');
  });

  const PORT = process.env.API_PORT || 3000;
  app.listen(PORT, () => {
    Logger.info('Server is running on port: ' + PORT);
  });
})();
