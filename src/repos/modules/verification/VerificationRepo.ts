import orm from './orm';
import { IVerificationCode } from '@src/types/verification';

/** 保存验证码 */
async function save(email: string, code: string, expiresInMinutes: number = 10): Promise<IVerificationCode> {
  const db = await orm.openDb();
  const now = Date.now();
  const expiresAt = now + expiresInMinutes * 60 * 1000;

  // 删除该邮箱的旧验证码
  db.codes = db.codes.filter(c => c.email !== email);

  const record: IVerificationCode = {
    email,
    code,
    createdAt: now,
    expiresAt,
  };

  db.codes.push(record);
  await orm.saveDb(db);
  return record;
}

/** 验证验证码 */
async function verify(email: string, code: string): Promise<boolean> {
  const db = await orm.openDb();
  const now = Date.now();

  const record = db.codes.find(c => c.email === email);
  if (!record) return false;

  // 检查是否过期
  if (record.expiresAt < now) {
    // 删除过期记录
    db.codes = db.codes.filter(c => c.email !== email);
    await orm.saveDb(db);
    return false;
  }

  // 验证码匹配
  if (record.code === code) {
    // 验证成功后删除该验证码
    db.codes = db.codes.filter(c => c.email !== email);
    await orm.saveDb(db);
    return true;
  }

  return false;
}

/** 清理过期验证码 */
async function cleanExpired(): Promise<number> {
  const db = await orm.openDb();
  const now = Date.now();
  const before = db.codes.length;

  db.codes = db.codes.filter(c => c.expiresAt >= now);
  await orm.saveDb(db);

  return before - db.codes.length;
}

export default {
  save,
  verify,
  cleanExpired,
} as const;
