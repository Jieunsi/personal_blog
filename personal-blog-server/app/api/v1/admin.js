/**
 * @description 管理员 API 路由
 */
const Router = require('koa-router');
const { adminController } = require('@controllers/admin');

const router = new Router({
	prefix: '/api/v1',
});

module.exports = router;