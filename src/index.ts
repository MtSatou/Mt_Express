import './pre-start'; // Must be the first import
import logger from '@src/util/log';
import http from 'http';

import EnvVars from '@src/constants/EnvVars';
import server from './server';
import { initializeWebSocket } from '@src/ws';

// 创建 HTTP 服务器
const httpServer = http.createServer(server);
// 初始化 WebSocket 服务
initializeWebSocket(httpServer, '/ws');

// 启动服务器
httpServer.listen(EnvVars.Port, () => {
  logger.info('WebSocket 服务已在 ws://localhost:' + EnvVars.Port + '/ws 启动');
  logger.info('HTTP 服务已在 http://localhost:' + EnvVars.Port.toString() + ' 启动');
});
