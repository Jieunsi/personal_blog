const Router = require('koa-router');
const { favorController } = require('@controllers/favor');
const { Auth } = require('@/middlewares/auth');
const USER_LEVEL = 8;

const router = new Router({
  prefix: '/api/v1/favor',
});

// 收藏/取消收藏文章
router.post('/favor', new Auth(USER_LEVEL).m, favorController.favor);
// 判断是否已经收藏该文章
router.get('/hasFavorite', favorController.hasFavorite);
// 获取已经收藏了的文章列表
router.get('/favorArticleList', favorController.favorArticleList);

module.exports = router;
