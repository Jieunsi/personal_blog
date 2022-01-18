const Router = require('koa-router');
const { UserController } = require('@controllers/user');

const router = new Router({
  prefix: '/api/v1',
});

module.exports = router;
