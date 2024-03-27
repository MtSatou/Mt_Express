import { Options as limitOptions } from "express-rate-limit";
interface netTypes {
  /**起始端口号 */
  port: number;
  /**最后一个端口号 */
  stopPort: number;
  /**服务启动时间搓 */
  startingTime: number;
  /**rateLimit配置项 */
  rateLimit: Partial<limitOptions>;
}

const windowMs = 15 * 60 * 1000;
const net: netTypes = {
  port: 5000,
  stopPort: 6000,
  startingTime: Date.now(),
  rateLimit: {
    windowMs,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: `访问次数过多，请于 ${windowMs / 1000 / 60} 分钟后再试`,
    statusCode: 429,
    max: 100
  },
};

export default net;
