import { Request, Response, NextFunction } from 'express';

/**
 * 全局响应包装中间件：拦截 res.json，将响应体按统一协议返回。
 *
 * 约定（业务要求）：
 * - 成功响应（HTTP 2xx）统一返回 HTTP 200，且 body 中包含 code = 0 表示成功；
 *   code = 0 -> 成功
 * - 参数校验失败返回 HTTP 400，body 中 code = 400 表示请求参数错误；
 *   code = 400 -> 请求参数校验失败
 * - token 校验失败返回 HTTP 403，body 中 code = 403 表示鉴权失败/无权限；
 *   code = 403 -> 鉴权失败（token 无效或缺失）
 * - 服务器内部错误返回 HTTP 500，body 中 code = 500 表示代码报错；
 *   code = 500 -> 服务器内部错误
 * - 网关/上游超时返回 HTTP 504，body 中 code = 504 表示网络超时；
 *   code = 504 -> 网络或上游超时
 *
 * 返回包装策略：
 * - 如果原始 body 是对象（且不含 code 字段），把 code 插入并展开对象：{ code, ...body }
 * - 如果原始 body 是数组或原始值，则包装为 { code, data: body }
 * - 如果原始响应已包含 code 字段，则保留原样，不覆盖
 */
export default function responseCodeMiddleware(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res) as (body?: any) => Response;

  (res as any).json = function (body?: any) {
    try {
      // If body is null/undefined -> wrap into data: null
      if (body === undefined || body === null) {
        const status = (res.statusCode || 200) as number;
        const code = status >= 200 && status < 300 ? 0 : status;
        return originalJson({ code, data: null });
      }

      // If body is an object but NOT an Array and doesn't already have code, spread it
      if (typeof body === 'object' && !Array.isArray(body) && !Object.prototype.hasOwnProperty.call(body, 'code')) {
        const status = (res.statusCode || 200) as number;
        // 成功 -> 统一 code 0；失败 -> code = status
        const code = status >= 200 && status < 300 ? 0 : status;
        // 若成功则强制响应 HTTP 200（业务要求：成功全部返回 200）
        if (status >= 200 && status < 300) {
          res.status(200);
        }
        const wrapped = { code, ...body };
        return originalJson(wrapped);
      }

      // For arrays or primitive values, wrap under data
      if (!Object.prototype.hasOwnProperty.call(body, 'code')) {
        const status = (res.statusCode || 200) as number;
        const code = status >= 200 && status < 300 ? 0 : status;
        if (status >= 200 && status < 300) {
          res.status(200);
        }
        return originalJson({ code, data: body });
      }
    } catch (err) {
      return originalJson(body);
    }
    return originalJson(body);
  } as any;

  return next();
}
