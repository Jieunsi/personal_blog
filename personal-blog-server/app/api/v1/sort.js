const Router = require('koa-router');
const { SortController } = require('@controllers/sort');

const router = new Router({
  prefix: '/api/v1',
});

module.exports = router;
