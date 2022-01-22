const {
  RegisterValidator,
  PositiveIdParamsValidator,
  UserLoginValidator,
} = require('@validators/user');
const { UserDao } = require('@dao/user');
const { LoginManager } = require('@service/login');
const { Resolve } = require('@lib/helper');
const res = new Resolve();


class UserController {
  /**
   * 注册
   */
  static async register(ctx) {
    const v = await new RegisterValidator().validate(ctx);
    const email = v.get('body.email');
    const password = v.get('body.password2');
    const nickname = v.get('body.nickname');
    const age = v.get('body.age');

    const [err, data] = await UserDao.create({
      password,
      email,
      nickname,
      age: age
    });

    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 用户登录
   */
  static async login(ctx) {
    const v = await new UserLoginValidator().validate(ctx);

    const [tokenErr, token, id] = await LoginManager.userLogin({
      email: v.get('body.email'),
      password: v.get('body.password')
    });

    if (!tokenErr) {
      const [err, data] = await UserDao.detail(id);
      if (!err) {
        data.setDataValue('token', token);
        ctx.response.status = 200;
        ctx.body = res.json(data);
      }
    } else {
      ctx.body = res.fail(tokenErr);
    }
  }

  /**
   * 获取用户信息
   */
  static async auth(ctx) {
    const id = ctx.auth.uid;
    
    const [err, data] = await UserDao.detail(id);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 获取用户列表
   * TODO 
   */
//   static async list(ctx) {
//     const [err, data] = await UserDao.list
//   }

  /**
   * 获取用户信息
   * 只有管理员及以上可以操作
   */
  static async detail(ctx) {
    const v = await new PositiveIdParamsValidator().validate(ctx);
    const id = v.get('path.id');
    const [err, data] = await UserDao.detail(id);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 删除用户
   * 只有管理员及以上可以操作
   */
  static async delete(ctx) {
    const v = await new PositiveIdParamsValidator().validate(ctx);
    const id = v.get('path.id');

    const [err] = await UserDao.delete(id);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('删除用户成功');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 更新用户信息
   * 只有管理员及以上可以操作
   */
  static async update(ctx) {
    const v = await new PositiveIdParamsValidator().validate(ctx);
    const id = v.get('path.id');
    const [err] = await UserDao.update(id, v);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('更新用户信息成功');
    } else {
      ctx.body = res.fail(err);
    }
  }
}

module.exports = { UserController };
