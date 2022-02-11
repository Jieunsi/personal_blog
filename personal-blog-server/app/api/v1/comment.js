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
// 修改评论
router.put('/update/:id', new Auth(USER_LEVEL).m, CommentController.update);
// 获取评论列表
router.get('/list', CommentController.list);
// 获取评论详情
router.get('/detail/:id', CommentController.detail);
// 获取关联目标下的评论列表
router.get('/target/list', CommentController.targetComment);

module.exports = router;
