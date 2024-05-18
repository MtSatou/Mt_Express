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
async function add(req: IReq<{user: IUser}>, res: IRes) {
  const { user } = req.body;
  await UserService.addOne(user);
  return res.status(HttpStatusCodes.CREATED).end();
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

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
