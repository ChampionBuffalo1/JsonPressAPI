import { Router } from 'express';
import userRouter from './route/userRoute';
import blogRouter from './route/blogRoute';

const apiRouter = Router();
apiRouter.get('/', (_, res) => {
  res.status(200).json({ message: 'Hello from API Router' });
});

apiRouter.use('/user', userRouter);
apiRouter.use('/blog', blogRouter);

export default apiRouter;
