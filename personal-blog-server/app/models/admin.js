const dayjs = require('dayjs');
const bcrypt = require('bcryptjs');
const { sequelize } = require('@core/db');
const { Model, DataTypes } = require('sequelize');

// 定义管理员模型
class Admin extends Model {}

// 建立管理员模型
Admin.init({
	id: {
		type: DataTypes.INTEGER(10).UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
		comment: '管理员主键 ID',
	},
	email: {
		type: DataTypes.STRING(50),
		// 唯一索引
		unique: 'admin_email_unique',
		allowNull: false,
		comment: '登录邮箱',
	},
  password: {
    type: DataTypes.STRING,
    set(value) {
      // 加盐
      const salt = bcrypt.genSalt();
      // 生成加密密码
      const pwd  = bcrypt.hashSync(value, salt);
      this.setDataValue('password', pwd);
    },
    allowNull: false,
    comment: '登录密码',
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '管理员昵称',
  }
}, {
  sequelize,
});

module.exports = {
  Admin
}
