/**
 * @description 文章 API 路由
 */
const Router = require('koa-router');
const ArticleController = require('@/app/controllers/article');

const router = new Router({
  prefix: '/api/v1'
});

// 创建文章
router.post('/article/create', ArticleController.create);

// 获取文章详情
router.get('/article/:id', ArticleController.detail);

module.exports = router;