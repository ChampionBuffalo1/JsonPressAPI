import cors from 'cors';
import express from 'express';
import apiRouter from './api';
import Logger from './lib/Logger';

(async () => {
  const app = express();
  app.use(cors(), express.json(), express.urlencoded({ extended: true }));
  app.use('/api', apiRouter);

  app.get('/', (_, res) => {
    res.send('Hello World!');
  });

  const PORT = process.env.API_PORT || 3000;
  app.listen(PORT, () => {
    Logger.info('Server is running on port: ' + PORT);
  });
})();
