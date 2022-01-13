const Router = require('koa-router');
const ArticleController = require('@/app/controllers/article');

const router = new Router({
  prefix: 'app/v1'
});

router.get('/article/:id', ArticleController.detail);

module.exports = router;