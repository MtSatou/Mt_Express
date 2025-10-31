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
  update,
  delete: delete_,
  register,
  login: UserService.login,
} as const;
