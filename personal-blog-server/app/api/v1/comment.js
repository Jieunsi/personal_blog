const Router = require('koa-router');
const { CommentController } = require('@controllers/comment');
const { Auth } = require('@/middlewares/auth');
const USER_LEVEL = 8;

const router = new Router({
  prefix: '/api/v1/comment',
});

// 创建评论
router.post('/create', new Auth(USER_LEVEL).m, CommentController.create);
// 删除评论
router.delete('/delete/:id', new Auth(USER_LEVEL).m, CommentController.delete);


module.exports = router;
