import UserRepo from '@src/repos/modules/user/UserRepo';
import { IUser } from '@src/types/user';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

export const USER_NOT_FOUND_ERR = 'User not found';

/**
 * 获取所有用户
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * 添加一个用户
 */
function addOne(user: IUser): Promise<void> {
  return UserRepo.add(user);
}

/**
 * 更新用户
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  return UserRepo.update(user);
}

/**
 * 通过id删除用户
 */
async function _delete(id: number): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  return UserRepo.delete(id);
}

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
} as const;
