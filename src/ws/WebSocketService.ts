import WebSocket from 'ws';
import { Server as HTTPServer } from 'http';
import logger from 'jet-logger';
import WebSocketRoutes from './WebSocketRoutes';
import ConnectionManager from './ConnectionManager';
import { MessageType, WSMessage } from './types';
import type { IncomingMessage } from 'http';
import { ExtendedWebSocket } from './types';
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

    // 启动心跳检测
    ConnectionManager.startHeartbeat();
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
    return ConnectionManager.getStats().total;
  }

  /**
   * 获取连接统计信息
   */
  getStats() {
    return ConnectionManager.getStats();
  }

  /**
   * 广播消息给所有客户端
   */
  broadcast(message: WSMessage): void {
    ConnectionManager.broadcast({
      ...message,
      type: MessageType.BROADCAST,
    });
  }

  /**
   * 向指定房间广播消息
   */
  broadcastToRoom(roomId: string, message: WSMessage, excludeIds: string[] = []): number {
    return ConnectionManager.broadcastToRoom(
      roomId,
      {
        ...message,
        type: MessageType.ROOM_MESSAGE,
      },
      excludeIds
    );
  }

  /**
   * 发送消息给指定客户端
   */
  sendToClient(clientId: string, message: WSMessage): boolean {
    return ConnectionManager.sendToClient(clientId, message);
  }

  /**
   * 按条件广播消息
   */
  broadcastWhere(predicate: (ws: ExtendedWebSocket) => boolean, message: WSMessage): number {
    return ConnectionManager.broadcastWhere(predicate, {
      ...message,
      type: MessageType.BROADCAST,
    });
  }

  /**
   * 获取所有房间列表
   */
  getRooms(): string[] {
    return ConnectionManager.getRooms();
  }

  /**
   * 获取房间中的客户端数量
   */
  getRoomSize(roomId: string): number {
    return ConnectionManager.getRoomSize(roomId);
  }

  /**
   * 获取客户端所在的房间列表
   */
  getClientRooms(clientId: string): string[] {
    return ConnectionManager.getClientRooms(clientId);
  }

  /**
   * 关闭 WebSocket 服务器
   */
  close(): void {
    // 停止心跳检测
    ConnectionManager.stopHeartbeat();

    // 清理所有连接
    ConnectionManager.cleanup();

    if (this.wss) {
      this.wss.close(() => {
        logger.info('WebSocket 服务器已关闭');
      });
    }
  }
}

// 导出单例
export default new WebSocketService();
