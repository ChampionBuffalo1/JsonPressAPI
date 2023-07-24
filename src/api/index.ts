import { Router } from 'express';

const apiRouter = Router();

apiRouter.get('/', (_, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

export default apiRouter;