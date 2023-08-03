import bcrypt from 'bcrypt';
import User from '../models/User';
import { Request, Response } from 'express';
import { bcryptRounds } from '../Constants';
import type { JwtPayload } from '../lib/passport';
import { generateJwtToken, getZodError } from '../lib';
import UserQueryHelper from '../models/query/userQueries';
import {
  loginSchema,
  createSchema,
  passwordSchema,
  userImageUpdate,
  userSocialUpdate
} from '../validators/userValidator';

async function userLogin(req: Request, res: Response) {
  const schema = await loginSchema.spa(req.body);
  if (schema.success) {
    const { email, password } = schema.data;
    const user = await UserQueryHelper.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);

    if (valid) {
      res.status(200).send({
        token: generateJwtToken({
          id: user.id,
          role: user.role
        }),
        user: {
          id: user.id,
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
      message: {
        password: 'Wrong email or password'
      }
    });
  } else {
    res.status(406).send({
      message: getZodError(schema.error)
    });
  }
}

async function getSelf(req: Request, res: Response) {
  const id = (req.user as JwtPayload)?.id;
  const user = await UserQueryHelper.getUser(id, 'name role image socialMedia');
  if (!user) {
    res.status(404).send({
      message: 'User not found'
    });
    return;
  }
  res.status(200).send({
    user
  });
}

async function getSelfRole(req: Request, res: Response) {
  res.status(200).send({
    role: (req.user as JwtPayload).role
  });
}

async function createUser(req: Request, res: Response) {
  const schema = await createSchema.spa(req.body);
  if (schema.success) {
    const { email, name, password } = schema.data;
    const passwordHash = await bcrypt.hash(password, bcryptRounds);
    try {
      const created = await UserQueryHelper.createUser(name, email, passwordHash);
      res.status(201).send({
        user: {
          role: created.role,
          name: created.name,
          image: created.image,
          email: created.email,
          socialMedia: created.socialMedia
        }
      });
    } catch (err) {
      if ((err as Error).message.startsWith('E11000')) {
        res.status(400).send({
          message: {
            email: 'Email already exists'
          }
        });
      }
    }
  } else {
    res.status(406).send({
      message: getZodError(schema.error)
    });
  }
}

async function changePassword(req: Request, res: Response) {
  const schema = await passwordSchema.spa(req.body);
  if (schema.success) {
    const id = (req.user as JwtPayload)?.id;
    const { password, oldpassword } = schema.data;
    const user = await UserQueryHelper.getUser(id, 'passwordHash');
    if (!user) {
      res.status(404).send({
        message: 'User not found'
      });
      return;
    }
    const valid = await bcrypt.compare(oldpassword, user.passwordHash);
    if (!valid) {
      res.status(401).send({
        message: {
          password: 'Wrong password'
        }
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
    const message = getZodError(schema.error);
    res.status(400).json({ message });
  }
}

async function changeImage(req: Request, res: Response) {
  const id = (req.user as JwtPayload)?.id;
  const schema = await userImageUpdate.spa(req.body);
  if (!schema.success) {
    const message = getZodError(schema.error);
    res.status(400).send({
      message
    });
    return;
  }
  const { image } = schema.data;
  const user = await UserQueryHelper.addImage(id, image);
  if (!user) {
    res.status(500).send({
      message: 'Something went wrong'
    });
    return;
  }
  res.status(200).send({
    user
  });
}

async function changeSocials(req: Request, res: Response) {
  const id = (req.user as JwtPayload)?.id;
  const schema = await userSocialUpdate.spa(req.body);
  if (!schema.success) {
    const message = getZodError(schema.error);
    res.status(400).send({
      message
    });
    return;
  }
  const { type, value } = schema.data;
  const user = await UserQueryHelper.userExists(id);
  if (!user) {
    res.status(404).send({
      message: 'User not found'
    });
    return;
  }
  const udpated = await UserQueryHelper.addSocialMedia(id, type, value);
  if (!udpated) {
    res.status(500).send({
      message: 'Something went wrong'
    });
    return;
  }
  res.status(200).send({
    udpated
  });
}

async function deleteSelf(req: Request, res: Response) {
  const id = (req.user as JwtPayload)?.id;
  if (!id) {
    res.status(400).send('No id provided');
    return;
  }
  const user = await UserQueryHelper.userExists(id);
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
}

export { userLogin, getSelf, getSelfRole, deleteSelf, createUser, changePassword, changeImage, changeSocials };
