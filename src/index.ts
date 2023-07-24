import express from 'express';
import cors from 'cors';
import Logger from './lib/Logger';
import api from './api';

(async () => {
  const app = express();
  app.use(cors(), express.json(), express.urlencoded({ extended: true }));
  app.use('/api', api);

  const PORT = process.env.API_PORT || 3000;
  app.listen(PORT, () => {
    Logger.info('Server is running on port: ' + PORT);
  });
})();
