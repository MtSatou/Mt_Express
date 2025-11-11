/**
 * Pre-start is where we want to place things that must run BEFORE the express 
 * server is started. This is useful for environment variables, command-line 
 * arguments, and cron-jobs.
 */

import path from 'path';
import dotenv from 'dotenv';
import logger from './util/log';
import { validateLicense, getLicenseInfo } from './util/license';

try {
  validateLicense();
  // eslint-disable-next-line no-console
  console.log(getLicenseInfo());
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  // eslint-disable-next-line no-console
  console.error(msg);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

// ---- Resolve ENV ---- //
// 从环境变量读取 NODE_ENV,默认为 development
const nodeEnv = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const envFile = `.env.${nodeEnv}`;
const envPath = path.join(__dirname, 'env', envFile);

const loaded = dotenv.config({ path: envPath });

if (loaded.error) {
  // 首选文件不存在或解析失败 -> 回退到默认 .env（在 CWD）
  logger.warn(`加载失败 ${envPath}: ${loaded.error.message}`);
  const fallback = dotenv.config();
  if (fallback.error) {
    logger.warn(`备用 .env 加载失败: ${fallback.error.message}`);
  }
} else {
  logger.info(`当前环境: ${loaded.parsed!.NODE_ENV}`);
}
