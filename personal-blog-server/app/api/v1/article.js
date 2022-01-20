/**
 * @description 文章 API 路由
 */
const Router = require('koa-router');
const { articleController } = require('@/app/controllers/article');

const router = new Router({
  prefix: '/api/v1/article',
});

// 创建文章
router.post('/create', articleController.create);
// 获取文章列表
router.get('/list', articleController.list);
// 获取文章详情
router.get('/:id', articleController.detail);

module.exports = router;
