import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import UserService from '@src/services/UserService';
import { IUser } from '@src/types/user';
import { IReq, IRes } from '../../types/express/misc';
import UserRepo from '@src/repos/modules/user/UserRepo';
import TokenUtil from '@src/util/token';
import EnvVars from '@src/constants/EnvVars';

/**
 * 获取所有用户。
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  return res.status(HttpStatusCodes.OK).json({ users });
}

/**
 * 添加一名用户。
 */
async function register(req: IReq<IUser>, res: IRes) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: '' });
  }
  await UserService.addOne(req.body);
  return res.status(HttpStatusCodes.CREATED).json({ message: '注册成功' }).end();
}

/**
 * 更新一名用户。
 */
async function update(req: IReq<{user: IUser}>, res: IRes) {
  const { user } = req.body;
  await UserService.updateOne(user);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * 删除一个用户。
 */
async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await UserService.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * 用户登录，无需auth
 */
async function login(req: IReq<{username: string; password: string}>, res: IRes) {
  const { username, password } = req.body as any;
  if (!username || !password) return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'username and password required' });

  // username 可以是 id 或 email
  let user = null as any;
  const asId = Number(username);
  if (!Number.isNaN(asId) && String(asId) === String(username)) {
    user = await UserRepo.getById(asId);
  }
  if (!user) {
    // 没有id视为email
    user = await UserRepo.getOne(String(username));
  }

  if (!user) {
    // 认证失败 -> 403
    return res.status(HttpStatusCodes.FORBIDDEN).json({ message: 'Invalid credentials' });
  }

  // 简单密码校验（示例项目）。生产请用哈希比较
  if ((user as any).password !== password) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({ message: 'Invalid credentials' });
  }

  // 生成 token，载荷包含 id 和 email。过期时间从 EnvVars.Jwt.Exp（ms）读取
  const expMs = Number(EnvVars.Jwt.Exp ?? process.env.COOKIE_EXP ?? 0) || (2 * 60 * 60 * 1000);
  const token = TokenUtil.signToken({ id: user.id, email: user.email }, Math.floor(expMs / 1000));
  // 计算过期时间（ms）
  const expiresAt = Date.now() + expMs;
  return res.status(HttpStatusCodes.OK).json({ token, expiresAt });
}

export default {
  getAll,
  register,
  update,
  delete: delete_,
  login: login,
} as const;
