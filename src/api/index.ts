import { Router } from 'express';
import userRouter from './route/userRoute';

const apiRouter = Router();
apiRouter.get('/', (_, res) => {
  res.status(200).json({ message: 'Hello from API Router' });
});

apiRouter.use('/user', userRouter);

export default apiRouter;
