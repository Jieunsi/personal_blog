const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('@core/db');

// 定义分类表
class Sort extends Model {}

Sort.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '文章分类的id',
    },
    sort_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '分类名',
    },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      comment: '父类别id，0 代表根节点',
    }
  },
  {
    sequelize,
  }
);

module.exports = {
  Sort,
};
