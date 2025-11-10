import pino from 'pino';
export const logger = pino({
  level: 'info',
  transport: { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } },
  redact: ['req.headers.authorization', 'password'],
});

export default {
  info: (msg: string) => logger.info({}, msg),
  warn: (msg: string) => logger.warn({}, msg),
  error: (e: unknown, msg = 'error') =>
    logger.error(e instanceof Error ? { err: e } : { err: msg }),
};