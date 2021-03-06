/**
 * @description 管理员的数据访问对象
 */

const { Admin } = require('@models/admin');
const bcrypt = require('bcryptjs');

class AdminDao {
  // 创建管理员
  static async create(params) {
    const { email, password, nickname } = params;

    // 不推荐直接 new 实例
    const admin = Admin.build();

    admin.nickname = nickname;
    admin.email = email;
    admin.password = password;

    try {
      const res = await admin.save();

      const data = {
        email: res.email,
        nickname: res.nickname,
      };

      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }

  // 验证密码
  static async verify(email, plainPassword) {
    try {
      // 查询用户是否存在
      const admin = await Admin.findOne({
        where: {
          email,
        },
      });
      if (!admin) {
        throw new global.errs.AuthFailed('账号不存在');
      }

      // 验证密码是否正确
      const correct = bcrypt.compareSync(plainPassword, admin.password);

      if (!correct) {
        throw new global.errs.AuthFailed('账号不存在或者密码不正确');
      }

      return [null, admin];
    } catch (err) {
      return [err, null];
    }
  }

  // 查询管理员信息
  static async detail(id) {
    const scope = 'bh';
    try {
      // 查询管理员是否存在
      const admin = await Admin.scope(scope).findOne({
        where: {
          id,
        },
      });

      if (!admin) {
        throw new global.errs.AuthFailed('账号不存在或者密码不正确');
      }

      return [null, admin];
    } catch (err) {
      return [err, null];
    }
  }
}

module.exports = {
  AdminDao,
};
