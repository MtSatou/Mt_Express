import { IUser } from '@src/types/user';
import { getRandomInt } from '@src/util/misc';
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


// **** Export default **** //

export default {
  getOne,
  getById,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
} as const;
