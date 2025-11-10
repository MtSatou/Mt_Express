import { Server as HTTPServer } from 'http';
import logger from '@src/util/log';
import WebSocketService from './WebSocketService';

/**
 * 初始化 WebSocket 模块
 * @param httpServer HTTP 服务器实例
 * @param path WebSocket 路径，默认为 '/ws'
 */
export function initializeWebSocket(httpServer: HTTPServer, path: string = '/ws') {
  try {
    WebSocketService.initialize(httpServer, path);
    logger.info('WebSocket 模块初始化完成');
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

/**
 * 获取 WebSocket 服务实例
 */
export function getWebSocketService() {
  return WebSocketService;
}
