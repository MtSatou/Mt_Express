import { IUser } from '@src/types/user';
import UserPepo from '@src/repos/modules/user/UserRepo';

const INVALID_CONSTRUCTOR_PARAM = 'with the appropriate user keys.';

/**
 * 创建新用户默认数据
 */
function new_(
  id?: number,
  username?: string,
  email?: string,
  password?: string,
  avatar?: string | null,
  code?: string,
): IUser {
  return {
    id: (id ?? -1),
    username: (username ?? ''),
    email: (email ?? ''),
    password: (password ?? ''),
    avatar: (avatar ?? null),
    code: code,
    created: new Date().toLocaleString(),
    updated: null,
    token: null,
    tokenExpiresAt: null,
    lastActiveAt: null,
  } as IUser;
}

/**
 * 通过一个符合用户的字段生成一个新用户
 */
async function newUser(param: IUser): Promise<IUser> {
  const allUsers = await UserPepo.getAll();
  // 用户id由这里设置，未设置锁，异步时可能会重复id。后续添加队列解决
  const id = 10000 + allUsers.length;
  param.id = id;
  if (!isUser(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  const p = param;
  return new_(p.id, p.username, p.email, p.password, p.avatar, p.code);
}

/**
 * 查看参数是否满足成为用户的标准。
 */
function isUser(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'id' in arg && typeof arg.id === 'number' &&
    'email' in arg && typeof arg.email === 'string' &&
    'username' in arg && typeof arg.username === 'string' &&
    'password' in arg && typeof arg.password === 'string'
  );
}

export {
  newUser,
  isUser,
};

// **** Export default **** //
export default {
  newUser,
  isUser,
} as const;
