import { Router } from 'express';
import passport from 'passport';
import { isManager, isLoggedIn } from '../../middleware/authorized';
import {
  getSelf,
  userLogin,
  createUser,
  deleteSelf,
  changeImage,
  getSelfRole,
  changeSocials,
  changePassword,
} from '../../controller/userController';

const userRouter = Router();

userRouter.post('/login', userLogin);

userRouter.use(passport.authenticate('jwt', { session: false }));

userRouter.get('/', isLoggedIn, getSelf);

userRouter.get('/getRole', isLoggedIn, getSelfRole);

userRouter.post('/create', isManager, createUser);

userRouter.post('/changePassword', isLoggedIn, changePassword);

userRouter.post('/changeImage', isLoggedIn, changeImage);

userRouter.post('/addSocial', isLoggedIn, changeSocials);

userRouter.post('/delete', isLoggedIn, deleteSelf);

export default userRouter;
