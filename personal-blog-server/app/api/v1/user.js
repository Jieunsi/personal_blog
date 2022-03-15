const Router = require('koa-router');
const { UserController } = require('@controllers/user');
const { Auth } = require('@/middlewares/auth');

const router = new Router({
  prefix: '/api/v1/user',
});

// 用户注册
router.post('/register', UserController.register);
// 用户登录
router.post('/login', UserController.login);
// 获取用户信息
router.get('/auth', new Auth(8).m, UserController.auth);
// 管理员查看用户信息
router.get('/detail/:id', new Auth(16).m, UserController.detail);
// 更新用户信息
router.post('/update/:id', new Auth(8).m, UserController.update);
// 删除用户
router.delete('/delete/:id', new Auth(16).m, UserController.delete);
// 获取用户列表
router.get('/list', new Auth(16).m, UserController.list);

module.exports = router;
