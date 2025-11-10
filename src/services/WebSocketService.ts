import WebSocket from 'ws';
import { Server as HTTPServer } from 'http';
import logger from '@src/util/log';
import { WebSocketRoutes, WSMessage } from '@src/ws';
import type { IncomingMessage } from 'http';

/**
 * WebSocket 服务类
 */
class WebSocketService {
  private wss: WebSocket.Server | null = null;

  /**
   * 初始化 WebSocket 服务器
   * @param server HTTP 服务器实例
   * @param path WebSocket 路径，默认为 '/ws'
   */
  initialize(server: HTTPServer, path: string = '/ws') {
    this.wss = new WebSocket.Server({
      server,
      path,
    });

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      WebSocketRoutes.handleConnection(ws, req);
    });

    logger.info(`WebSocket 初始化成功`);
  }

  /**
   * 获取 WebSocket 服务器实例
   */
  getServer(): WebSocket.Server | null {
    return this.wss;
  }

  /**
   * 获取当前连接数
   */
  getConnectionCount(): number {
    return this.wss?.clients.size ?? 0;
  }

  /**
   * 广播消息给所有客户端
   */
  broadcast(message: WSMessage): void {
    if (this.wss) {
      WebSocketRoutes.broadcast(this.wss, message);
    }
  }

  /**
   * 关闭 WebSocket 服务器
   */
  close(): void {
    if (this.wss) {
      this.wss.close(() => {
        logger.info('WebSocket 服务器已关闭');
      });
    }
  }
}

// 导出单例
export default new WebSocketService();
