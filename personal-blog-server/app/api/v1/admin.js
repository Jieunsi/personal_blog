/**
 * @description 管理员 API 路由
 */
const Router = require('koa-router');
const { adminController } = require('@controllers/admin');
const { Auth } = require('@/middlewares/auth');

const router = new Router({
	prefix: '/api/v1/admin',
});

// 注册
router.post('/register', adminController.register);
// 登录
router.post('/login', adminController.login);
// 获取管理员信息
router.post('/auth', new Auth(16).m, adminController.auth);

module.exports = router;