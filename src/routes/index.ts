import { Router } from 'express';
import userRouter, { Base as UserBase } from './modules/user';
import wsRouter, { Base as WsBase } from '../ws';

const apiRouter = Router();

// 添加子服务 用户路由
apiRouter.use(UserBase, userRouter);

// 添加子服务 WebSocket 路由
apiRouter.use(WsBase, wsRouter);

export default apiRouter;
