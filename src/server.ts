/**
 * 初始化应用实例
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from '@src/util/log';

import 'express-async-errors';

import BaseRouter from '@src/routes';
import EnvVars from '@src/constants/EnvVars';
import responseCode from '@src/routes/middleware/responseCode';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';

const app = express();

// 添加中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// 全局响应包装（在路由注册之前生效）
app.use(responseCode);

// 显示开发期间在控制台中调用的路由
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// 安全
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// 注册接口
app.use(EnvVars.ApiBase, BaseRouter);

// 添加错误处理程序
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.error(err);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});


// 设置静态目录，可直接通过访问端口/文件 (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// 设置上传文件的静态访问目录
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// 访问 /重定向
// app.get('/', (_: Request, res: Response) => {
//   return res.redirect('/users');
// });

export default app;
