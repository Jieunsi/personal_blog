const Router = require('koa-router');
const { ReplyController } = require('@controllers/reply');

const router = new Router({
  prefix: '/api/v1',
});

module.exports = router;
