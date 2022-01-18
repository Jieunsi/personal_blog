const Router = require('koa-router');
const { CommentController } = require('@controllers/comment');

const router = new Router({
  prefix: '/api/v1',
});

module.exports = router;
