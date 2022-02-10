const qiniu = require('qiniu');
const ak = 'A0Pyqq3CfMCW3boTL37TZ0VKxpEjXDoI2AEKpHzB';
const sk = 's1wVMpy3Uj8rknKEPHP1oWj02aWOio01MMqlsHII';
const mac = new qiniu.auth.digest.Mac(ak, sk);

const { Auth } = require('@middlewares/auth');
const AUTH_ADMIN = 16;
const { Resolve } = require('@lib/helper');
const res = new Resolve();

const Router = require('koa-router');

const router = new Router({
  prefix: '/api/v1'
})

router.post('/upload/token', new Auth(AUTH_ADMIN).m, async(ctx) => {
  const options = {
    scope: 'chenzhijieblog',
    expires: 7200,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  ctx.response.status = 200;
  const data = {
    token: putPolicy.uploadToken(mac)
  }
  ctx.body = res.json(data)
})

module.exports = router