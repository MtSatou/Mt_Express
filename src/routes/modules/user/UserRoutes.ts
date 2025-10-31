import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import UserService from '@src/services/UserService';
import { IUser } from '@src/types/user';
import { IReq, IRes } from '../../types/express/misc';

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

export default {
  getAll,
  update,
  delete: delete_,
  register,
  login,
} as const;
