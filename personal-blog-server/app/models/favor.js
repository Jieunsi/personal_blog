const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('@core/db');

class Favor extends Model {}

Favor.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '用户收藏文章的id',
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '用户的id',
    },
    article_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '文章的id',
    },
  },
  {
    sequelize,
  }
);

module.exports = {
  Favor,
};
