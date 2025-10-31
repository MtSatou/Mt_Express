/**
 * 应用程序所有生效的路由必须在这里注册
 */

export default {
  // 根路由 -> localhsot:3000/api
  Base: '/api',
  Users: {
    // user路由 -> localhost:3000/users
    Base: '/users',
    // user/all -> localhost:3000/users/all
    Get: '/all',
    // 登录（获取 token）
    Login: '/login',
    // user/add -> localhost:3000/users/add
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
