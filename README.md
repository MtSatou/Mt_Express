# 关于Mt_Express
使用express二次开发的服务框架，用于纯后端应用服务。仅用于学习讨论

nodejs版本要求：`18 < n <20`。

## 启动服务
`npm install` 初始化项目
`npm run dev` 启动服务，默认开启端口 `3000`，如需修改请查看 `/env` 文件夹中的环境变量 `PORT` 字段进行修改。

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
