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
 * 添加一名用户。
 * /users/register
 */
userRouter.post(
  '/register',
  validate(['username', 'string']),
  validate(['email', 'string']),
  validate(['password', 'string']),
  UserRoutes.register,
);

/**
 * 更新用户。
 * /users/update
 */
userRouter.put(
  '/update',
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

/**
 * 校验 token 是否有效（支持 Authorization header / query / body）
 * GET /users/validate-token?token=... 或 POST /users/validate-token { token }
 */
userRouter.get(
  '/validate-token',
  UserRoutes.validateToken,
);

userRouter.post(
  '/validate-token',
  UserRoutes.validateToken,
);

/**
 * 刷新当前用户 token（需要认证）
 */
userRouter.post(
  '/refresh-token',
  auth,
  UserRoutes.refreshToken,
);

export default userRouter;