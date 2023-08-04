import bcrypt from 'bcrypt';
import User from '../models/User';
import { Request, Response } from 'express';
import { bcryptRounds } from '../Constants';
import type { JwtPayload } from '../lib/passport';
import UserQueryHelper from '../models/query/userQueries';
import { generateJwtToken, getZodError, sendError } from '../lib';
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
      return sendError(res, 'E404', 404);
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
    sendError(res, 'E401', 401);
  } else {
    sendError(res, 'EZ01', 400, getZodError(schema.error));
  }
}

async function getSelf(req: Request, res: Response) {
  const id = (req.user as JwtPayload)?.id;
  const user = await UserQueryHelper.getUser(id, 'name role image socialMedia');
  if (!user) {
    return sendError(res, 'E404', 404);
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
        sendError(res, 'E409', 409);
      }
    }
  } else {
    sendError(res, 'EZ01', 400, getZodError(schema.error));
  }
}

async function changePassword(req: Request, res: Response) {
  const schema = await passwordSchema.spa(req.body);
  if (schema.success) {
    const id = (req.user as JwtPayload)?.id;
    const { password, oldpassword } = schema.data;
    const user = await UserQueryHelper.getUser(id, 'passwordHash');
    if (!user) {
      return sendError(res, 'E404', 404);
    }
    const valid = await bcrypt.compare(oldpassword, user.passwordHash);
    if (!valid) {
      return sendError(res, 'E401', 401);
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
    sendError(res, 'EZ01', 400, getZodError(schema.error));
  }
}

async function changeImage(req: Request, res: Response) {
  const id = (req.user as JwtPayload)?.id;
  const schema = await userImageUpdate.spa(req.body);
  if (!schema.success) {
    return sendError(res, 'EZ01', 400, getZodError(schema.error));
  }
  const { image } = schema.data;
  const user = await UserQueryHelper.addImage(id, image);
  if (!user) {
    return sendError(res, 'E404', 404);
  }
  res.status(200).send({
    user
  });
}

async function changeSocials(req: Request, res: Response) {
  const id = (req.user as JwtPayload)?.id;
  const schema = await userSocialUpdate.spa(req.body);
  if (!schema.success) {
    return sendError(res, 'EZ01', 400, getZodError(schema.error));
  }
  const { type, value } = schema.data;
  const user = await UserQueryHelper.userExists(id);
  if (!user) {
    return sendError(res, 'E404', 404);
  }
  const udpated = await UserQueryHelper.addSocialMedia(id, type, value);
  if (!udpated) {
    return sendError(res, 'E500');
  }
  res.status(200).send({
    udpated
  });
}

async function deleteSelf(req: Request, res: Response) {
  const id = (req.user as JwtPayload)?.id;
  if (!id) {
    return sendError(res, 'E400', 400);
  }
  const user = await UserQueryHelper.userExists(id);
  if (!user) {
    return sendError(res, 'E404', 404);
  }
  const deleted = await User.deleteOne({
    _id: id
  });
  if (deleted.deletedCount === 1) {
    res.status(200).send({
      message: 'User deleted'
    });
  } else {
    sendError(res, 'E500', 500);
  }
}

export { userLogin, getSelf, getSelfRole, deleteSelf, createUser, changePassword, changeImage, changeSocials };
