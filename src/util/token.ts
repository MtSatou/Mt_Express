import jwt from 'jsonwebtoken';
import EnvVars from '@src/constants/EnvVars';

const SECRET = EnvVars.Jwt.Secret || (process.env.JWT_SECRET ?? 'dev-secret');

export interface TokenPayload {
  id: number;
  email?: string;
  [k: string]: unknown;
}

/** 将过期时间统一从 EnvVars 获取（ms）并转换为 seconds 传给 jsonwebtoken */
function defaultExpirySeconds(): number {
  const expMs = Number(EnvVars.Jwt.Exp ?? process.env.COOKIE_EXP ?? 0);
  if (!expMs || isNaN(expMs)) {
    // 默认 2 小时
    return 2 * 60 * 60;
  }
  return Math.max(1, Math.floor(expMs / 1000));
}

/** 生成 JWT token，expiresSeconds 可选（秒） */
export function signToken(payload: TokenPayload, expiresSeconds?: number) {
  const expiresIn = expiresSeconds ?? defaultExpirySeconds();
  // 使用 any 以兼容当前 jsonwebtoken 类型声明
  return jwt.sign(payload, SECRET, { expiresIn: expiresIn });
}

/** 校验 token，成功返回 payload，否则抛错 */
export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, SECRET);
  return decoded as TokenPayload;
}

export default {
  signToken,
  verifyToken,
};
