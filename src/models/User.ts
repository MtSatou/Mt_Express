import moment from 'moment';
import { IUser } from '@src/types/user';

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';

/**
 * 创建新用户默认数据
 */
function new_(
  name?: string,
  email?: string,
  password?: string,
  created?: Date,
  id?: number, // id 放在最后一个参数是因为通常由数据库设置
  avatar?: string | null,
  code?: string,
): IUser {
  return {
    id: (id ?? -1),
    name: (name ?? ''),
    email: (email ?? ''),
    password: (password ?? ''),
    code: code,
    avatar: (avatar ?? null),
    created: (created ? new Date(created) : new Date()),
    updated: null,
    token: null,
    tokenExpiresAt: null,
    lastActiveAt: null,
  } as IUser;
}

/**
 * 通过一个符合用户的字段生成一个新用户
 */
function from(param: object): IUser {
  if (!isUser(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  const p = param as IUser;
  return new_(p.name, p.email, p.password, p.created, p.id, p.avatar, p.code);
}

/**
 * 查看参数是否满足成为用户的标准。
 */
function isUser(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
  'id' in arg && typeof (arg as any).id === 'number' &&
  'email' in arg && typeof (arg as any).email === 'string' &&
  'name' in arg && typeof (arg as any).name === 'string' &&
  'password' in arg && typeof (arg as any).password === 'string' &&
  'created' in arg && moment((arg as any).created as string | Date).isValid()
  );
}


// **** Export default **** //
export default {
  new: new_,
  from,
  isUser,
} as const;
