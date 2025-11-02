import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq, IRes } from '../../types/express/misc';
import UserRepo from '@src/repos/modules/user/UserRepo';
import VerificationRepo from '@src/repos/modules/verification/VerificationRepo';
import { sendVerificationEmail, generateVerificationCode } from '@src/util/email';

/** 发送验证码：POST /verification/send  body: { email } */
async function sendCode(req: IReq<{ email: string }>, res: IRes) {
  const email = String((req.body as any)?.email || '').trim();

  if (!email) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: '邮箱不能为空' });
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: '邮箱格式不正确' });
  }

  // 检查邮箱是否已存在
  const existingUser = await UserRepo.getOne(email);
  if (existingUser) {
    return res.status(HttpStatusCodes.CONFLICT).json({ message: '该邮箱已被注册' });
  }

  // 生成验证码
  const code = generateVerificationCode();

  try {
    // 发送邮件
    const sent = await sendVerificationEmail(email, code);
    if (!sent) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: '邮件发送失败，请稍后重试' });
    }

    // 保存验证码（10分钟有效期）
    await VerificationRepo.save(email, code, 10);

    return res.status(HttpStatusCodes.OK).json({ 
      message: '验证码已发送，请查收邮件',
      email,
    });
  } catch (e: any) {
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: e?.message || '发送失败' 
    });
  }
}

/** 验证验证码：POST /verification/verify  body: { email, code } */
async function verifyCode(req: IReq<{ email: string; code: string }>, res: IRes) {
  const email = String((req.body as any)?.email || '').trim();
  const code = String((req.body as any)?.code || '').trim();

  if (!email || !code) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: '邮箱和验证码不能为空' });
  }

  const isValid = await VerificationRepo.verify(email, code);

  if (isValid) {
    return res.status(HttpStatusCodes.OK).json({ 
      valid: true,
      message: '验证成功',
    });
  } else {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ 
      valid: false,
      message: '验证码错误或已过期',
    });
  }
}

export default {
  sendCode,
  verifyCode,
} as const;
