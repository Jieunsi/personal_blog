/**
 * @description 文章标签 API 路由
 */
const Router = require('koa-router');
const { articleLabelController } = require('@controllers/article_label');
const { Auth } = require('@/middlewares/auth');
const ADMIN_LEVEL = 16;

const router = new Router({
  prefix: '/api/v1/article-label',
});

// 给文章增加标签
router.post('/create', new Auth(ADMIN_LEVEL).m, articleLabelController.create);
// 给文章删除标签
router.delete('/delete/:id', new Auth(ADMIN_LEVEL).m, articleLabelController.delete);
// 获取某文章的所有标签
router.get('/list', articleLabelController.list);

module.exports = router;
