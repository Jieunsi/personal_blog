const { Op } = require('sequelize');
const bcrypt = require ('bcryptjs');
const { User } = require('@models/user');

class UserDao {
  /**
   * 创建用户
   */
  static async create(params = {}) {
    const { nickname, email, password, age } = params;
    const exist = await User.findOne({
      where: {
        email,
        deleted_at:  null
      }
    });

    if (exist) {
      throw new global.errs.Existing('该邮箱已注册');
    }

    const user = User.build();
    user.nickname = nickname;
    user.password = password;
    user.email = email;
    if (age) {
      user.age = age;
    }
    
    try {
      const res = await user.save();
      const data = {
        email: res.email,
        nickname: res.nickname
      }
      if (age) {
        data.age = age;
      }
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 验证密码
   */
  static async verify(email, plainPwd) {
    try {
      const user = await User.findOne({
        where: {
          email
        }
      });
      if (!user) {
        throw new global.errs.AuthFailed('账号不存在');
      }

      const correct = bcrypt.compareSync(plainPwd, user.password);
      if (!correct) {
        throw new global.errs.AuthFailed('账号或密码不正确');
      }

      return [null, user];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 查询用户信息
   */
  static async detail(id) {
    try {
      const user = await User.scope('bh').findByPk(id);
      if (!user) {
        throw new global.errs.AuthFailed('账号不存在');
      }

      return [null, user];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 删除用户
   */
  static async delete(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new global.errs.NotFound('没有该用户');
    }

    try {
      const res = await user.destroy();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 更新用户
   */
  static async update(id, v) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new global.errs.NotFound('没有此用户');
    }

    if (v.get('body.nickname')) {
      user.nickname = v.get('body.nickname');
    }
    if (v.get('body.email')) {
      user.email = v.get('body.email');
    }
    if (v.get('body.age')) {
      user.age = v.get('body.age');
    }

    try {
      const res = await user.save();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

}

module.exports = { UserDao };