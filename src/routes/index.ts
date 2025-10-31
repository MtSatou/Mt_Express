import { Router } from 'express';
import userRouter, { Base as UserBase } from './modules/user';

const apiRouter = Router();

// 添加子服务 用户路由
apiRouter.use(UserBase, userRouter);

export default apiRouter;
