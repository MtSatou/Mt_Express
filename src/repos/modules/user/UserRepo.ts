import { IUser } from '@src/types/user';
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
        username: user.username ?? dbUser.username,
        email: user.email,
        password: user.password ?? dbUser.password,
        avatar: user.avatar ?? dbUser.avatar,
        updated: user.updated ?? new Date().toLocaleString(),
      } as IUser;
      return orm.saveDb(db);
    }
  }
}

/**
 * 设置用户当前有效 token 与到期时间（毫秒）
 */
async function setToken(
  id: number,
  token: string | null,
  tokenExpiresAt: number | null,
): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.users.length; i++) {
    if (db.users[i].id === id) {
      const dbUser = db.users[i];
      db.users[i] = {
        ...dbUser,
        token,
        tokenExpiresAt,
      };
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





// **** Export default **** //

export default {
  getOne,
  getById,
  getByUsername,
  persists,
  getAll,
  add,
  update,
  setToken,
  delete: delete_,
} as const;
