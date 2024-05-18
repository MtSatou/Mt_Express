import * as e from 'express';

/**express请求体类型 */
export interface IReq<T = void> extends e.Request {
  body: T;
}

/**express响应体类型 */
export interface IRes extends e.Response {
  locals: Record<string, unknown>;
}
