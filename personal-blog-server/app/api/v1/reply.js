const Router = require('koa-router');
const { ReplyController } = require('@controllers/reply');
const { Auth } = require('@middlewares/auth');
const AUTH_ADMIN = 16;
const router = new Router({
  prefix: '/api/v1/reply',
});

// 创建回复
router.post('/create', ReplyController.create);
// 删除回复
router.delete('/delete/:id', new Auth(AUTH_ADMIN).m, ReplyController.delete);
// 修改回复
router.put('/update/:id', new Auth(AUTH_ADMIN).m, ReplyController.update);
// 获取回复列表
router.get('/list', ReplyController.list);
// 获取回复详情
router.get('/detail/:id', ReplyController.detail);

module.exports = router;
