import WebSocket from 'ws';

/**
 * 扩展的 WebSocket 连接，包含额外的元数据
 */
export interface ExtendedWebSocket extends WebSocket {
  id: string;                    // 唯一标识符
  isAlive: boolean;              // 心跳检测标记
  userId?: string | number;      // 用户 ID（可选）
  rooms: Set<string>;            // 加入的房间列表
  metadata?: Record<string, any>; // 自定义元数据
  lastPing?: number;             // 最后一次 ping 时间
  connectedAt: number;           // 连接时间戳
}

/**
 * 消息类型枚举
 */
export enum MessageType {
  PING = 'ping',
  PONG = 'pong',
  MESSAGE = 'message',
  BROADCAST = 'broadcast',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  ROOM_MESSAGE = 'room_message',
  ERROR = 'error',
  SYSTEM = 'system',
}

/**
 * 标准消息格式
 */
export interface WSMessage {
  type: MessageType | string;
  data?: any;
  room?: string;
  timestamp?: string;
  from?: string;
}

/**
 * 连接统计信息
 */
export interface ConnectionStats {
  total: number;              // 总连接数
  active: number;             // 活跃连接数
  rooms: Record<string, number>; // 各房间连接数
  uptime: number;             // 服务运行时间（秒）
}
