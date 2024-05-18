import { Router } from 'express';
import jetValidator from 'jet-validator';
import UserRoutes from './UserRoutes';
import Paths from '@src/routes/paths';
import User from '@src/models/User';

const validate = jetValidator();
const userRouter = Router();

userRouter.get(
  Paths.Users.Get,
  UserRoutes.getAll,
);

userRouter.post(
  Paths.Users.Add,
  validate(['user', User.isUser]),
  UserRoutes.add,
);

userRouter.put(
  Paths.Users.Update,
  validate(['user', User.isUser]),
  UserRoutes.update,
);

userRouter.delete(
  Paths.Users.Delete,
  validate(['id', 'number', 'params']),
  UserRoutes.delete,
);

export default userRouter;