const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('@core/db');

// 定义回复表
class Reply extends Model {}

Reply.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '回复主键 ID',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '回复内容',
    },
    comment_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '关联的评论 ID',
    },
    article_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '关联的文章 ID',
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '评论用户 id',
    },
    reply_user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '回复对象 id',
    },
  },
  {
    sequelize,
  }
);

module.exports = {
  reply,
};
