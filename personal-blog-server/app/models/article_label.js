const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('@core/db');

// 文章的标签
class ArticleLabel extends Model {}

ArticleLabel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '文章的标签的id',
    },
    article_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '文章的id',
    },
    label_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '标签的id',
    },
    label_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '标签名称'
    }
  },
  {
    sequelize,
  }
);

module.exports = {
  ArticleLabel,
};
