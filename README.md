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


