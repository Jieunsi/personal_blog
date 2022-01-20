/**
 * @description 管理员控制器
 */
const { RegisterValidator, AdminLoginValidator } = require('@validators/admin');
const { AdminDao } = require('@dao/admin');
const { Auth } = require('@middlewares/auth');
const { LoginManager } = require('@service/login');
const { Resolve } = require('@lib/helper');
const res = new Resolve();

class adminController {
  // 管理员注册
  static async register(ctx) {
    // 校验参数
    try {
      const value = await new RegisterValidator().validate(ctx);
      // 创建管理员
      const [err, data] = await AdminDao.create({
        email: value.get('body.email'),
        password: value.get('body.password2'),
        nickname: value.get('body.nickname'),
      });
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } catch (err) {
      ctx.body = res.fail(err);
    }
  }

  // 管理员登录
  static async login(ctx) {
    const value = await new AdminLoginValidator().validate(ctx);

    const [err, token] = await LoginManager.adminLogin({
      email: value.get('body.email'),
      password: value.get('body.password'),
    });

    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json({ token });
    } else {
      ctx.body = res.fail(err, err.msg);
    }
  }

  // 获取管理员信息
  static async auth(ctx) {
    const id = ctx.auth.uid;
    const [err, data] = await AdminDao.detail(id);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }
}

module.exports = {
  adminController,
};
