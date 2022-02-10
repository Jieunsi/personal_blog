const Router = require('koa-router');
const { SortController } = require('@controllers/sort');
const { Auth } = require('@/middlewares/auth');
const ADMIN_LEVEL = 16;


const router = new Router({
  prefix: '/api/v1/sort',
});

// 创建分类
router.post('/create', new Auth(ADMIN_LEVEL).m, SortController.create);
// 删除分类
router.delete('/delete/:id',new Auth(ADMIN_LEVEL).m, SortController.delete);
// 更新分类
router.put('/update/:id', new Auth(ADMIN_LEVEL).m, SortController.update);
// 获取分类列表
router.get('/list', SortController.list);
// 获取分类详情
router.get('/detail/:id', SortController.detail);

module.exports = router;
