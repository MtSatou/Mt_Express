/** 全局限流 */
import rateLimit from 'express-rate-limit';

/** 全局限流 1分钟100次请求 */
export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,           // 1 分钟窗口
  max: 100,                         // 同一客户端最多 100 次
  standardHeaders: true,             // 写入 RateLimit-* 响应头
  legacyHeaders: false,              // 关闭 X-RateLimit-* 旧头
  message: { error: '请求次数过多，请稍后再试' },
});

/** 局部限流 15分钟10次请求 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 分钟
  max: 10,                   // 给登录/注册/发邮件等敏感接口
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '请求次数过多，请稍后再试' },
});