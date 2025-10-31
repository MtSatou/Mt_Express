import { Router } from 'express';
import WebSocketRoutes from './WebSocketRoutes';

// 模块自身的基础路由（挂载点由 src/routes/index.ts 注册）
export const Base = '/ws';

const wsRouter = Router();

/**
 * 获取 WebSocket 状态
 * GET /ws/status
 */
wsRouter.get(
  '/status',
  WebSocketRoutes.getStatus,
);

export default wsRouter;

// 导出 WebSocket 相关模块
export { default as WebSocketRoutes } from './WebSocketRoutes';
export { default as WebSocketService } from './WebSocketService';
export { default as ConnectionManager } from './ConnectionManager';
export { initializeWebSocket, getWebSocketService } from './wsInit';
export * from './types';
