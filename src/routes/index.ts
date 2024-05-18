import { Router } from 'express';
import Paths from './paths';
import userRouter from './modules/user';

const apiRouter = Router();

// 添加子服务 用户路由
apiRouter.use(Paths.Users.Base, userRouter);

export default apiRouter;
