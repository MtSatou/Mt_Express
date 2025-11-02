import { Router } from 'express';
import userRouter, { Base as UserBase } from './modules/user';
import wsRouter, { Base as WsBase } from '../ws';
import uploadRouter, { Base as UploadBase } from './modules/upload';
import verificationRouter, { Base as VerificationBase } from './modules/verification';

const apiRouter = Router();

// 添加子服务 邮箱验证路由
apiRouter.use(VerificationBase, verificationRouter);

// 添加子服务 文件上传路由
apiRouter.use(UploadBase, uploadRouter);

// 添加子服务 用户路由
apiRouter.use(UserBase, userRouter);

// 添加子服务 WebSocket 路由
apiRouter.use(WsBase, wsRouter);

export default apiRouter;
