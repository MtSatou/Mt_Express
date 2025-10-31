import { IUser } from '@src/types/user';
import { IReq, IRes } from '@src/routes/types/express/misc';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import TokenUtil from '@src/util/token';
import EnvVars from '@src/constants/EnvVars';
import orm from './orm';

/**
 * 获取指定email用户
 */
async function getOne(email: string): Promise<IUser | null> {
  const db = await orm.openDb();
  for (const user of db.users) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

/**
 * 通过 id 获取用户
 */
async function getById(id: number): Promise<IUser | null> {
  const db = await orm.openDb();
  for (const user of db.users) {
    if (user.id === id) {
      return user;
    }
  }
  return null;
}

/**
 * 通过 username 获取用户
 */
async function getByUsername(username: string): Promise<IUser | null> {
  const db = await orm.openDb();
  for (const user of db.users) {
    if (user.username === username) {
      return user;
    }
  }
  return null;
}

/**
 * 寻找指定id用户是否存在
 */
async function persists(id: number): Promise<boolean> {
  const db = await orm.openDb();
  for (const user of db.users) {
    if (user.id === id) {
      return true;
    }
  }
  return false;
}

/**
 * 获取所有用户
 */
async function getAll(): Promise<IUser[]> {
  const db = await orm.openDb();
  return db.users;
}

/**
 * 添加一名用户
 */
async function add(user: IUser): Promise<void> {
  const db = await orm.openDb();
  db.users.push(user);
  return orm.saveDb(db);
}

/**
 * 更新用户
 */
async function update(user: IUser): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.users.length; i++) {
    if (db.users[i].id === user.id) {
      const dbUser = db.users[i];
      db.users[i] = {
        ...dbUser,
        username: (user as any).username ?? dbUser.username,
        email: user.email,
        // allow updating optional fields if provided
        password: (user as any).password ?? dbUser.password,
        avatar: (user as any).avatar ?? dbUser.avatar,
        updated: (user as any).updated ?? new Date(),
      } as IUser;
      return orm.saveDb(db);
    }
  }
}

/**
 * 删除用户
 */
async function delete_(id: number): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.users.length; i++) {
    if (db.users[i].id === id) {
      db.users.splice(i, 1);
      return orm.saveDb(db);
    }
  }
}


/**
 * 登录
 */
async function login(req: IReq<{username: string; password: string}>, res: IRes) {
  const { username, password } = req.body as any;
  if (!username || !password) return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: '请输入用户名或密码' });

  // username 可以是 id 或 email
  let user = null as any;
  const asId = Number(username);
  if (!Number.isNaN(asId) && String(asId) === String(username)) {
    user = await getById(asId);
  }
  if (!user) {
    // 没有id视为email
    user = await getOne(String(username));
  }

  if (!user) {
    // 认证失败 -> 403
    return res.status(HttpStatusCodes.FORBIDDEN).json({ message: '用户名或密码错误' });
  }

  // 简单密码校验（示例项目）。生产请用哈希比较
  if ((user as any).password !== password) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({ message: '用户名或密码错误' });
  }

  // 生成 token，载荷包含 id 和 email。过期时间从 EnvVars.Jwt.Exp（ms）读取
  const expMs = Number(EnvVars.Jwt.Exp ?? process.env.COOKIE_EXP ?? 0) || (2 * 60 * 60 * 1000);
  const token = TokenUtil.signToken({ id: user.id, email: user.email }, Math.floor(expMs / 1000));
  // 计算过期时间（ms）
  const expiresAt = Date.now() + expMs;
  return res.status(HttpStatusCodes.OK).json({ token, expiresAt, user });
}


// **** Export default **** //

export default {
  getOne,
  getById,
  getByUsername,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  login
} as const;
