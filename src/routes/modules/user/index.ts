import { Router } from 'express';
import jetValidator from 'jet-validator';
import UserRoutes from './UserRoutes';
import Paths from '@src/routes/paths';
import User from '@src/models/User';
import auth from '@src/routes/middleware/auth';

const validate = jetValidator();
const userRouter = Router();

userRouter.get(
  Paths.Users.Get,
  auth,
  UserRoutes.getAll,
);

userRouter.post(
  Paths.Users.Add,
  validate(['user', User.isUser]),
  auth,
  UserRoutes.register,
);

userRouter.put(
  Paths.Users.Update,
  validate(['user', User.isUser]),
  auth,
  UserRoutes.update,
);

userRouter.delete(
  Paths.Users.Delete,
  validate(['id', 'number', 'params']),
  auth,
  UserRoutes.delete,
);

// login (unprotected)
userRouter.post(
  Paths.Users.Login,
  validate(['email', 'string']),
  UserRoutes.login,
);

export default userRouter;