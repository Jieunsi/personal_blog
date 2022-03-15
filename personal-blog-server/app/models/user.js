const dayjs = require('dayjs');
const bcrypt = require('bcryptjs');
const { sequelize } = require('@core/db');
const { DataTypes, Model } = require('sequelize');

// 定义用户表
class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '用户主键ID',
    },
    password: {
      type: DataTypes.STRING,
      set(val) {
        // 加密
        const salt = bcrypt.genSaltSync(10);
        // 生成加密密码
        const psw = bcrypt.hashSync(val, salt);
        this.setDataValue('password', psw);
      },
      allowNull: false,
      comment: '登录密码',
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '用户昵称',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'user_email_unique',
      comment: '邮箱',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '创建时间',
      get() {
        return dayjs(this.getDataValue('created_at')).format(
          'YYYY-MM-DD HH:mm:ss'
        );
      },
    },
    age: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '年龄',
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '头像链接'
    }
  },
  {
    sequelize,
  }
);

module.exports = {
  User,
};
