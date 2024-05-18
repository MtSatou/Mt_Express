import HttpStatusCodes from '@src/constants/HttpStatusCodes';

/**
 * 状态代码和消息错误
 */
export class RouteError extends Error {
  public status: HttpStatusCodes;
  public constructor(status: HttpStatusCodes, message: string) {
    super(message);
    this.status = status;
  }
}
