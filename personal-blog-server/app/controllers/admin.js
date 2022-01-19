/**
 * @description 管理员控制器
 */
const { RegisterValidator, AdminLoginValidator } = require('@validators/admin');
const { AdminDao } = require('@dao/admin');
const { Auth } = require('@middlewares/auth')
const { LoginManager } = require('@service/login')
const { Resolve } = require('@lib/helper')
const res = new Resolve();

class adminController {
  // 管理员注册
  static async register(ctx) {
    // 校验参数
    let value = new RegisterValidator();
    value = await value.validate(ctx);

    // 创建管理员
    const [err, data] = await AdminDao.create({
      email: value.get('body.email'),
      password: value.get('body.password2'),
      nickname: value.get('body.nickname')
    });

    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }
}

module.exports = {
  adminController
};