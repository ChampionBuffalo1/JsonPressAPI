import bcrypt from 'bcrypt';
import { Router } from 'express';
import passport from 'passport';
import type { ZodIssue } from 'zod';
import User from '../../models/User';
import { generateJwtToken } from '../../lib';
import { UserType } from '../../typings/model';
import { bcryptRounds } from '../../Constants';
import { isAllowedToCreate, isLoggedIn } from '../../middleware/authorized';
import { userCreate, userImageUpdate, userLogin, userPassSchema, userSocialUpdate } from '../../validators';
import {
  getUser,
  addImage,
  userExists,
  createUser,
  addSocialMedia,
  getUserByEmail
} from '../../controller/userController';

const userRouter = Router();

userRouter.post('/login', async (req, res) => {
  const schema = await userLogin.spa(req.body);
  if (schema.success) {
    const { email, password } = schema.data;
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (valid) {
      res.status(200).send({
        token: generateJwtToken(user._id.toString()),
        user: {
          role: user.role,
          name: user.name,
          image: user.image,
          email: user.email,
          socialMedia: user.socialMedia
        }
      });
      return;
    }
    res.status(401).send({
      error: 'Wrong password'
    });
  } else {
    res.status(406).send(schema.error);
  }
});

userRouter.use(passport.authenticate('jwt', { session: false }));

userRouter.post('/create', isLoggedIn, isAllowedToCreate, async (req, res) => {
  const schema = await userCreate.spa(req.body);
  if (schema.success) {
    const { email, name, password } = schema.data;
    const passwordHash = await bcrypt.hash(password, bcryptRounds);
    try {
      const created = await createUser(name, email, passwordHash);
      const token = generateJwtToken(created._id.toString());
      res.status(201).send({
        user: {
          role: created.role,
          name: created.name,
          image: created.image,
          email: created.email,
          socialMedia: created.socialMedia
        },
        token
      });
    } catch (err) {
      // @ts-ignore: Code is attached to the error
      if ((err as Error).code === 11000) {
        res.status(400).send({
          error: 'Email already exists'
        });
      }
    }
  } else {
    res.status(406).send(schema.error);
  }
});

userRouter.post('/changePassword', isLoggedIn, async (req, res) => {
  const schema = await userPassSchema.spa(req.body);
  if (schema.success) {
    const id = (req.user as UserType)?._id.toString();
    const { password, oldpassword } = schema.data;
    const user = await getUser(id, 'passwordHash');
    if (!user) {
      res.status(404).send({
        error: 'User not found'
      });
      return;
    }
    const valid = await bcrypt.compare(oldpassword, user.passwordHash);
    if (!valid) {
      res.status(401).send({
        error: 'Wrong password'
      });
      return;
    }
    const newHash = await bcrypt.hash(password, bcryptRounds);
    await User.findOneAndUpdate(
      {
        _id: id
      },
      { passwordHash: newHash }
    );
    res.send({
      message: 'Password changed'
    });
  } else {
    const error = getZodError(schema.error.issues);
    res.status(400).json({ error });
  }
});

userRouter.get('/', isLoggedIn, async (req, res) => {
  const id = (req.user as UserType)?._id.toString();
  const user = await getUser(id, 'name role image socialMedia');
  if (!user) {
    res.status(404).send({
      message: 'User not found'
    });
    return;
  }
  res.status(200).send({
    user
  });
});

userRouter.post('/changeImage', isLoggedIn, async (req, res) => {
  const id = (req.user as UserType)?._id.toString();
  const schema = await userImageUpdate.spa(req.body);
  if (!schema.success) {
    const error = getZodError(schema.error.issues);
    res.status(400).send({
      error
    });
    return;
  }
  const { image } = schema.data;
  const user = await addImage(id, image);
  if (!user) {
    res.status(500).send({
      message: 'Something went wrong'
    });
    return;
  }
  res.status(200).send({
    user
  });
});

userRouter.post('/addSocial', isLoggedIn, async (req, res) => {
  const id = (req.user as UserType)?._id.toString();
  const schema = await userSocialUpdate.spa(req.body);
  if (!schema.success) {
    const error = getZodError(schema.error.issues);
    res.status(400).send({
      error
    });
    return;
  }
  const { type, value } = schema.data;
  const user = await userExists(id);
  if (!user) {
    res.status(404).send({
      message: 'User not found'
    });
    return;
  }
  const udpated = await addSocialMedia(id, type, value);
  if (!udpated) {
    res.status(500).send({
      message: 'Something went wrong'
    });
    return;
  }
  res.status(200).send({
    udpated
  });
});

userRouter.post('/delete', isLoggedIn, async (req, res) => {
  const id = (req.user as UserType)?._id.toString();
  if (!id) {
    res.status(400).send('No id provided');
    return;
  }
  const user = await userExists(id);
  if (!user) {
    res.status(404).send('No user found');
    return;
  }
  const deleted = await User.deleteOne({
    _id: id
  });
  if (deleted.deletedCount === 1) {
    res.status(200).send({
      message: 'User deleted'
    });
  } else {
    res.status(500).send({
      message: 'Something went wrong'
    });
  }
});

export default userRouter;

function getZodError(issues: ZodIssue[]) {
  const errorMessages: Record<string, string> = {};
  for (const issue of issues) {
    if (issue.path) {
      errorMessages[issue.path.join('.')] = issue.message;
    }
  }
  return errorMessages;
}
