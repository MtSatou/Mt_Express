import { Router } from 'express';
import jetValidator from 'jet-validator';
import UserRoutes from './UserRoutes';
import User from '@src/models/User';
import auth from '@src/routes/middleware/auth';

// 模块自身的基础路由（挂载点由 src/routes/index.ts 注册）
export const Base = '/users';

const validate = jetValidator();
const userRouter = Router();

/**
 * 获取所有用户。
 * /users/all
 */
userRouter.get(
  '/all',
  auth,
  UserRoutes.getAll,
);

/**
 * 添加一名用户。
 * /users/add
 */
userRouter.post(
  '/add',
  validate(['user', User.isUser]),
  auth,
  UserRoutes.register,
);

/**
 * 更新一名用户。
 * /users/update
 */
userRouter.put(
  '/update',
  validate(['user', User.isUser]),
  auth,
  UserRoutes.update,
);

/**
 * 删除一个用户。
 * /users/delete/:id
 */
userRouter.delete(
  '/delete/:id',
  validate(['id', 'number', 'params']),
  auth,
  UserRoutes.delete,
);

/**
 * 用户登录，无需auth
 * /users/login
 */
userRouter.post(
  '/login',
  validate(['username', 'string']),
  validate(['password', 'string']),
  UserRoutes.login,
);

export default userRouter;