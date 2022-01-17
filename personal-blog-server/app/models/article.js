const { sequelize } = require('@/core/db');
const dayjs = require('dayjs');
const { Model, DataTypes } = require('sequelize');

/**
 * @description 定义文章模型，对应数据库表 Article
 */
class Article extends Model {}

Article.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '文章主键 id',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '文章标题',
    },
    author_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '作者id',
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '文章封面链接',
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      comment: '文章内容',
    },
    views: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      comment: '文章浏览次数',
    },
    likes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      comment: '文章点赞次数',
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '关联分类 ID',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '创建时间',
      get() {
        return dayjs(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss'); 
      }
    }
  },
  {
    sequelize,
  }
);

module.exports = {
  Article,
};
