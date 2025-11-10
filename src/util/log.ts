import pino from 'pino';
import pretty from 'pino-pretty';

const prettyStream = pretty({
  colorize: true,
  translateTime: 'SYS:standard',
});

export const logger = pino(
  { level: 'info', redact: ['req.headers.authorization', 'password'] },
  prettyStream,
);

export default {
  info: (msg: string) => logger.info({}, msg),
  warn: (msg: string) => logger.warn({}, msg),
  error: (e: unknown, msg = 'error') =>
    logger.error(e instanceof Error ? { err: e } : { err: msg }),
};
