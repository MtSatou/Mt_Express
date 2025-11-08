# 关于Mt_Express
使用express二次开发的服务框架，用于纯后端应用服务。仅用于学习讨论

nodejs版本要求：`18 < n`。

## ⚠️ 重要提示：运行许可验证

本项目实施了**运行许可验证机制**。程序启动前会自动检查 `LICENSE` 文件：

- **许可协议**: GNU General Public License v3.0 (GPL-3.0)
- **项目仓库**: https://github.com/MtSatou/MTE
- **作者**: MtSatou

### 许可验证说明

✅ **程序启动时会验证**:
1. LICENSE 文件是否存在于项目根目录
2. 文件内容是否包含 GPL 协议标识
3. 文件内容是否包含项目仓库地址

❌ **如果验证失败**:
- 程序将显示详细错误信息并终止运行
- 请从 [GitHub仓库](https://github.com/MtSatou/MTE) 获取完整的 LICENSE 文件

📖 **详细说明**: 查看 [LICENSE_CHECK.md](./LICENSE_CHECK.md) 了解更多信息

⚠️ **请勿删除或修改 LICENSE 文件**，否则程序将无法启动！

## 功能特性

1. **WS**：支持ws链接，实现广播/心跳检测/房间功能
2. **Token鉴权**：内置Token鉴权，实现API权限拦截
3. **文件上传**：支持文件上传
4. **邮件支持**：支持发送邮件，需配置邮箱
5. **模块化管理**：使用Router/Service/pepos分离管理
6. **内置用户模块**：实现用户的增删改查
7. **内置验证码模块**：通过邮件模块发送验证码保存

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

### 发送邮件
#### 全局配置
如需使用该模块，请至 `/env` 文件中配置相关设置
```bash
## Email Configuration ##
# SMTP 服务器配置
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
# 发件人邮箱和密码
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
# 发件人显示名称
EMAIL_FROM=MTExpress <your-email@gmail.com>
```

#### 发送验证码
- `post` /verification/send
- `body`
  - email `string` `收件人`

- 添加成功行为
  - 验证码存储于 /repos/db 文件夹
  - 成功返回
  ```js
  {
    "code": 0,
    "message": "验证码已发送，请查收邮件",
    "email": "xx@xx.com"
  }
  ```

#### 消费验证码
验证邮箱 + 验证码是否匹配且未过期
- `post` /verification/verify
- `body`
  - email `string` `收件人`
  - code `string` `验证码`

- 添加成功行为
  - 移除验证码
  - 成功返回
  ```js
  {
    "valid": true,
    "message": "验证成功"
  }
  ```

### 文件上传
#### 上传单个文件
- `post` /upload
- `header`
  - Authorization `Bearer Token`
- `Content-Type`: `multipart/form-data`
- `form-data`
  - file `file` `文件`

- 添加成功行为
  - 数据存储于 /repos/db 文件夹
  - 文件存储于 uploads 文件夹
  - 成功返回
  ```js
  {
    "id": 1,
    // 源文件名
    "originalName": "avatar.jpg",
    // 服务端文件名
    "storedName": "20251102_1762050024918_1236.jpg",
    // 服务端文件路径
    "filePath": "/uploads/20251102_1762050024918_1236.jpg",
    // 文件大小
    "fileSize": 53886,
    // 文件类型
    "mimeType": "image/jpeg",
    // 上传时间
    "uploadTime": "2025/11/2 10:20:24"
  }
  ```


#### 获取我的上传列表
- `get` /upload/list
- `header`
  - Authorization `Bearer Token`

- 添加成功行为
  - 成功返回
  ```js
  {
    "code": 0,
    "uploads": [
        {
        "id": 1,
        // 源文件名
        "originalName": "avatar.jpg",
        // 服务端文件名
        "storedName": "20251102_1762050024918_1236.jpg",
        // 服务端文件路径
        "filePath": "/uploads/20251102_1762050024918_1236.jpg",
        // 文件大小
        "fileSize": 53886,
        // 文件类型
        "mimeType": "image/jpeg",
        // 上传时间
        "uploadTime": "2025/11/2 10:20:24"
      },
      // ...
    ]
  }
  ```


#### 通过文件id获取单个上传记录
只能查看自己的上传记录
- `get` /upload/:id
- `header`
  - Authorization `Bearer Token`

- 添加成功行为
  - 成功返回
  ```js
  {
    "code": 0,
    "uploads": {
      "id": 1,
      // 源文件名
      "originalName": "avatar.jpg",
      // 服务端文件名
      "storedName": "20251102_1762050024918_1236.jpg",
      // 服务端文件路径
      "filePath": "/uploads/20251102_1762050024918_1236.jpg",
      // 文件大小
      "fileSize": 53886,
      // 文件类型
      "mimeType": "image/jpeg",
      // 上传时间
      "uploadTime": "2025/11/2 10:20:24"
    }
  }
  ```



#### 通过文件id删除上传记录
只能删除自己的上传记录
- `delete` /upload/:id
- `header`
  - Authorization `Bearer Token`

- 添加成功行为
  - 不删除文件
  - 只删除数据
  - 成功返回
  ```js
  {
    "code": 0,
    "message": "删除成功"
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
检验token是否有效
- `post` /users/validate-token
- `header`
  - Authorization `Bearer Token`
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
    },
    "user": {}
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