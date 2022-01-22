/**
 * @description 文章 API 路由
 */
const Router = require('koa-router');
const { articleController } = require('@/app/controllers/article');
const { Auth } = require('@middlewares/auth');

const router = new Router({
  prefix: '/api/v1/article',
});

// 创建文章
router.post('/create', articleController.create);
// 获取文章列表
router.get('/list', articleController.list);
// 删除文章
router.delete('/delete/:id', new Auth(16).m, articleController.delete);
// 更新文章
router.put('/update/:id', new Auth(16).m, articleController.update);
// 更新点赞次数
router.put('/like/:id', new Auth(16).m, articleController.like);
// 获取文章详情
router.get('/detail/:id', articleController.detail);

module.exports = router;
