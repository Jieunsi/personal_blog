
const jwt = require('jsonwebtoken')

class Auth {
  constructor(level) {
    this.level = level || 1;

    Auth.USER = 8;
    Auth.ADMIN = 16;
    Auth.SPUSER_ADMIN = 32;
  }

  get m() {
    // token 检测
    // token 开发者 传递令牌
    // token body header
    // HTTP 规定 身份验证机制 Bearer
    return async (ctx, next) => {
      const { authorization  } = ctx.request.header;
      let errMsg = "无效的token";
      // 无token
      if (!authorization) {
        errMsg = "需要携带token值";
        throw new global.errs.Forbidden(errMsg);
      }
      const token = authorization.replace('Bearer ', '');

      try {
        // var decode = jwt.verify(tokenToken.name, global.config.security.secretKey);
        var info = jwt.verify(token, global.config.security.secretKey);
      } catch (error) {
        // token 不合法 过期
        if (error.name === 'TokenExpiredError') {
          errMsg = "登录状态已过期"
        }
        throw new global.errs.Forbidden(errMsg);
      }

      if (info.scope < this.level) {
        errMsg = "权限不足"
        throw new global.errs.Forbidden(errMsg);
      }

      ctx.auth = {
        uid: info.uid,
        scope: info.scope
      }
      await next()
    }
  }

}

module.exports = {
  Auth
}
