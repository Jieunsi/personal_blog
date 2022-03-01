const Router = require('koa-router');
const { likesController } = require('@controllers/likes');
const { Auth } = require('@/middlewares/auth');
const USER_LEVEL = 8;

const router = new Router({
  prefix: '/api/v1/likes',
});

// 点赞文章
router.post('/like', new Auth(USER_LEVEL).m, likesController.like);
// 取消点赞文章
router.post('/unlike', new Auth(USER_LEVEL).m, likesController.unlike);
// 判断是否已经点赞该文章
router.get('/liked', likesController.liked);
// 获取已经点赞了的文章列表
router.get('/likeArticleList', likesController.likeArticleList);

module.exports = router;
