const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('@core/db');

// 文章标签
class Label extends Model {}

Label.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '文章标签的id',
    },
    sort_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '标签名',
    },
  },
  {
    sequelize,
  }
);

module.exports = {
  Label,
};
