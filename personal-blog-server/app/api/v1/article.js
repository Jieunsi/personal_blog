/**
 * @description 文章 API 路由
 */
const Router = require('koa-router');
const { articleController } = require('@/app/controllers/article');

const router = new Router({
  prefix: '/api/v1',
});

// 创建文章
router.post('/article/create', articleController.create);

// 获取文章详情
router.get('/article/:id', articleController.detail);

module.exports = router;
