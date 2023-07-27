import { UserType } from '../typings/model';
import type { NextFunction, Request, Response } from 'express';

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();

  res.status(401).send({
    message: 'You are not logged in'
  });
}

function isManager(req: Request, res: Response, next: NextFunction) {
  if (
    req.isAuthenticated() &&
    ((req.user as UserType)?.role === 'admin' || (req.user as UserType)?.role === 'manager')
  ) {
    return next();
  }

  res.status(401).send({
    message: 'User must be admin or manager to perform this action'
  });
}

export { isLoggedIn, isManager };
