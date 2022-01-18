const Router = require('koa-router');
const { LabelController } = require('@controllers/label');

const router = new Router({
  prefix: '/api/v1',
});

module.exports = router;
