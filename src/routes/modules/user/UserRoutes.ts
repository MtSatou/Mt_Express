import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import UserService from '@src/services/UserService';
import { IUser } from '@src/types/user';
import { IReq, IRes } from '../../types/express/misc';
import TokenUtil, { TokenPayload } from '@src/util/token';
import jwt from 'jsonwebtoken';
import UserRepo from '@src/repos/modules/user/UserRepo';

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
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: '请输入有效内容' });
  }
  await UserService.addOne(req.body);
  return res.status(HttpStatusCodes.CREATED).json({ message: '注册成功' }).end();
}

/**
 * 更新用户。
 */
async function update(req: IReq<IUser>, res: IRes) {
  const auth = (res.locals as any).auth as { id?: number } | undefined;
  if (!auth || !auth.id) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({ message: '无效的用户' });
  }

  const user = req.body;

  // 仅允许用户更新自己
  const userId = user.id ?? auth.id;
  if (Number(userId) !== Number(auth.id)) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({ message: '更新失败' });
  }

  const toUpdate: Partial<IUser> = {
    id: Number(auth.id),
    username: (user as any).username ?? undefined,
    avatar: (user as any).avatar ?? undefined,
    password: (user as any).password ?? undefined,
    email: (user as any).email ?? undefined,
    updated: new Date().toLocaleString(),
  } as Partial<IUser>;

  // 删除非法键
  Object.keys(toUpdate).forEach((k) => {
    if ((toUpdate as any)[k] === undefined) delete (toUpdate as any)[k];
  });

  await UserService.updateOne(Number(auth.id), toUpdate as Partial<IUser>);
  return res.status(HttpStatusCodes.OK).json({ message: '更新成功' });
}

/**
 * 用户注销。
 */
async function delete_(req: IReq, res: IRes) {
  const auth = (res.locals as any).auth as { id?: number } | undefined;
  if (!auth || !auth.id) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({ message: '注销失败' });
  }

  const id = Number(req.params.id ?? auth.id);
  if (Number(id) !== Number(auth.id)) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({ message: '注销失败' });
  }

  await UserService.delete(id);
  return res.status(HttpStatusCodes.OK).json({ message: '注销成功' });
}

/**
 * 登录
 */
async function login(req: IReq<{ username: string; password: string }>, res: IRes) {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: '缺少字段' });
  }
  const { token, expiresAt, user } = await UserService.login(username, password);
  return res.status(HttpStatusCodes.OK).json({ token, expiresAt, user });
}

/**
 * 校验 token 是否有效
 * 支持 Authorization: Bearer <token> 或 query/body 中的 token 字段
 */
async function validateToken(req: IReq, res: IRes) {
  const headerToken = req.headers['authorization']?.startsWith('Bearer ')
    ? req.headers['authorization']!.slice(7)
    : (req.headers['authorization'] as string) || '';
  const queryToken = (req.query as any)?.token ? String((req.query as any).token) : '';
  const bodyToken = (req.body as any)?.token ? String((req.body as any).token) : '';
  const token = headerToken || queryToken || bodyToken;

  if (!token) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ valid: false, message: '缺少 token' });
  }

  try {
    const payload = TokenUtil.verifyToken(token);
    // 额外：检查该 token 是否与用户记录中当前 token 匹配（以支持刷新后废弃旧 token）
    const user = await UserRepo.getById(Number((payload as any).id));
    if (!user) {
      return res.status(HttpStatusCodes.FORBIDDEN).json({ valid: false, message: '无效的Token' });
    }
    if (!((user as any).token) || ((user as any).token) !== token) {
      return res.status(HttpStatusCodes.FORBIDDEN).json({ valid: false, message: '无效的Token' });
    }
    return res.status(HttpStatusCodes.OK).json({ valid: true, payload, user });
  } catch (err) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({ valid: false, message: '无效的Token' });
  }
}

/**
 * 刷新当前用户的 token（延长过期时间）
 * 需要 auth 中间件将解析后的 payload 放到 res.locals.auth
 */
async function refreshToken(req: IReq, res: IRes) {
  const auth = (res.locals as any).auth as TokenPayload | undefined;
  if (!auth || !auth.id) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({ message: '无效的用户' });
  }

  // 复制 payload 并移除 iat/exp 等自动字段
  const payload: Record<string, any> = { ...auth } as Record<string, any>;
  delete payload.iat;
  delete payload.exp;
  delete payload.nbf;

  // 签发新的 token（使用默认过期时间）
  const token = TokenUtil.signToken(payload as any);

  // 解析 token 获得过期时间（以毫秒为单位）并持久化到用户记录中，废弃旧 token
  const decoded: any = jwt.decode(token);
  const expiresAtMs = decoded?.exp ? Number(decoded.exp) * 1000 : null;
  await UserRepo.setToken(Number(auth.id), token, expiresAtMs);

  return res.status(HttpStatusCodes.OK).json({ token, expiresAt: expiresAtMs });
}

export default {
  getAll,
  update,
  delete: delete_,
  register,
  login,
  validateToken,
  refreshToken,
} as const;
