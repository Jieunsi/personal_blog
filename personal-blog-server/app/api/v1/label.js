const Router = require('koa-router');
const { LabelController } = require('@controllers/label');
const { Auth } = require('@/middlewares/auth');
const ADMIN_LEVEL = 16;

const router = new Router({
  prefix: '/api/v1/label',
});

// 增加标签
router.post('/create', new Auth(ADMIN_LEVEL).m, LabelController.create);
// 删除标签
router.delete('/delete/:id', new Auth(ADMIN_LEVEL).m, LabelController.delete);
// 获取标签列表
router.get('/list', LabelController.list);
// 更新标签
router.put('/update/:id', new Auth(ADMIN_LEVEL).m, LabelController.update);

module.exports = router;
