import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import TokenUtil from '@src/util/token';

/**
 * 支持从 Authorization: Bearer <token> 获取 token 并验证
 * 验证成功后把解析后的 payload 放到 res.locals.auth
 */
export default function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = (req.headers.authorization || '') as string;
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader || '';
  if (!token) {
    // 返回 403 (FORBIDDEN) 表示没有权限/认证失败
    return res.status(HttpStatusCodes.FORBIDDEN).json({ message: '无效的Token' });
  }

  try {
    const payload = TokenUtil.verifyToken(token);
    // 放入当前响应的 locals 中，供后续中间件和路由使用
    (res.locals as any).auth = payload;
    return next();
  } catch (err) {
    // token 不合法或过期 -> 403
    return res.status(HttpStatusCodes.FORBIDDEN).json({ message: '无效的Token' });
  }
}
