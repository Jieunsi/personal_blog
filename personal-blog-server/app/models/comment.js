const dayjs = require('dayjs');
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('@core/db');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '评论主键ID',
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      comment: '评论内容',
    },
    article_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '关联的评论文章ID',
    },
    parent_comment_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '父级评论 ID',
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '评论用户ID',
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
  },
  {
    sequelize,
  }
);

module.exports = {
  Comment,
};
