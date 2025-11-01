# 关于Mt_Express
使用express二次开发的服务框架，用于纯后端应用服务。仅用于学习讨论

nodejs版本要求：`18 < n`。

## 功能特性

1. **WS**：支持ws链接，实现广播/心跳检测/房间功能
2. **Token鉴权**：内置Token鉴权，实现API权限拦截
3. **模块化管理**：使用Router/Service/pepos分离管理
4. **内置用户模块**：实现用户的增删改查

## 启动服务
`npm install` 初始化项目
`npm run dev` 启动服务，默认开启HTTP端口 `3000` 与 WS端口`3000`，如需修改请查看 `/env` 文件夹中的环境变量 `PORT` 字段进行修改。

## 打包
`npm run build` 打包。打包完成后将在根目录生成 `dist` 文件夹。进入 `dist` 文件夹执行 `node index.js` 测试能否正常启动。


## 文件说明
```bash
- src
  - public    静态目录
  - constants 常量目录，包含环境变量配置与响应状态码
  - repos     操作数据库相关
  - routers   路由API配置
  - services  服务，路由所对应的业务操作在这里
  - models    模块，通常用于给服务添加辅助类。如参数校验器
  - util      工具类函数
  - other     其他
  - types     ts类型

```

## 权限
应用已全局内置权限设置，只需在对应接口添加 `auth` 函数即可。参考：
MTExpress\src\routes\modules\user\index.ts

```js
import auth from '@src/routes/middleware/auth';
// porst 请求 /test 路径
userRouter.post(
  '/test',
  // 该路径必须包含 user/email/password 字段，且字段类型必须为指定类型
  validate(['username', 'string']),
  validate(['age', 'number']),
  // auth 为程序校验token函数，加入后必须传入有效token才能进入servers
  auth,
  // servers 函数
  UserRoutes.register,
);
```

## 内置接口

### 全局响应
```js
{
  code: 0,
  message: "内容"
}
```

### 用户接口 /user

#### 用户信息
```ts
{
  // 唯一id
  id: number;
  // 用户昵称
  username: string;
  // 邮箱
  email: string;
  // 登录密码
  password: string;
  // 可选密码/验证码字段（register 时传入）
  code?: string;
  // 头像
  avatar?: string | null;
  // 创建/更新时间
  created: Date | string;
  updated?: Date | string | null;
  // 当前 token 与过期时间（ms 时间戳）
  token?: string | null;
  tokenExpiresAt?: number | null;
  // 最后一次活跃时间（ms 时间戳）
  lastActiveAt?: number | null;
}

```

#### 添加用户 
- `post` /user/register 
- `body`
  - username `string` `用户名`
  - password `string` `密码` (明文 -> 哈希)
  - email `string` `邮箱`
  - avatar `string可选` `头像` `后续改为file 直接存文件路径`

- 添加成功行为
  - 存储用户数据
  ```js
  {
      "id": 0,
      "username": "zhangsan",
      "email": "123@163.com",
      "password": "12345678",
      "avatar": "**.jpg",
      "created": "1990/01/01 12:00:00",
      "updated": null,
      "token": null,
      "tokenExpiresAt": null,
      "lastActiveAt": null
    }
  ```

  
#### 登录
- `post` /user/login 
- `body`
  - username `string` `用户ID或邮箱`
  - password `string` `密码`

- 登录成功行为
  - jsonwebtoken 生成token与存储
  - 接口返回
  ```js
  {
    "code": 0,
    "token": "",
    "expiresAt": 0,
    "user": {} // 用户信息
  }
  ```


#### 更新用户 
仅允许自己更新自己
- `put` /user/update 
- `header`
  - Authorization `Bearer Token`
- `body`
  - id `number` `用户id`
  - username `string可选` `用户名`
  - password `string可选` `密码`
  - email `string可选` `邮箱`
  - avatar `string可选` `头像`

- 添加成功行为
  - 更新用户数据
  - 接口返回
  ```js
  {
    "code": 0,
    "message": "更新成功"
  }
  ```

#### 用户注销 
仅允许注销自己
- `delete` /user/delete 
- `header`
  - Authorization `Bearer Token`
- `param`
  - id `number` `用户id`

- 添加成功行为
  - 更新用户数据
  - 接口返回
  ```js
  {
    "code": 0,
    "message": "注销成功"
  }
  ```

#### 检验token是否有效
检验token是否有效（无需鉴权）
- `post` /users/validate-token
- `body`
  - id `token` `无需 Bearer的Token`

- 添加成功行为
  - 接口返回
  ```js
  {
    "code": 0,
    "valid": true,
    "payload": {
        "id": 0,
        "email": "xxx",
        "iat": 0,
        "exp": 0
    }
  }
  ```

#### 刷新token
仅刷新自己
- `post` /users/validate-token
- `header`
  - Authorization `Bearer Token`

- 添加成功行为
  - 接口返回
  ```js
  {
    "code": 0,
    "token": "",
    "expiresAt": 0
  }
  ```

## WebSocket 

### 功能特性

1. **模块化设计**：按照项目现有的模块化结构组织
2. **心跳检测**：支持心跳检测与房间通信
3. **实时通信**：支持服务器与客户端的双向通信
4. **消息广播**：支持向所有连接的客户端广播消息
5. **错误处理**：完善的错误处理和日志记录

### HTTP 接口
#### 获取 WebSocket 状态
- `get` /ws/status

- 响应示例
```json
{
  "code": 0,
  "total": 0,  // 总数
  "active": 0, // 在线
  "rooms": {   // 已开启的房间
      "2": 1
  },
  "connections": 0,
  "message": "WebSocket 服务运行中"
}
```

### WS 接口
基础链接地址 `ws://localhost:3000/ws`

#### 发送给指定人
```js
import ConnectionManager from '@/ws/ConnectionManager';
// 用户id，由uuid生成
ConnectionManager.sendToClient("用户id", {
  // MessageType.ERROR 为枚举类型，有各种消息类型
  type: MessageType.ERROR,
  data: { message: '发送失败' },
});
```

#### 广播消息给所有客户端
```ts
import WebSocketService from '@src/services/WebSocketService';
WebSocketService.broadcast({
  type: 'notification',
  message: '系统通知',
  timestamp: new Date().toISOString()
});
```

#### 加入房间
```ts
import ConnectionManager from '@/ws/ConnectionManager';
ConnectionManager.joinRoom('人员id', '房间号');
```

#### 广播给指定房间
```ts
ConnectionManager.broadcastToRoom(
  "房间ID",
  {
    // 房间消息
    type: MessageType.ROOM_MESSAGE,
    // 消息体
    data: message.data,
    // 发送者
    from: clientId,
  },
  // 排除发送者
  [clientId]
)
```

#### 离开房间
```ts
import ConnectionManager from '@/ws/ConnectionManager';
ConnectionManager.leaveRoom(clientId, message.room);
```

### WS 测试
启动服务后 访问 `/src/public/ws-advanced-test.html` 文件测试功能