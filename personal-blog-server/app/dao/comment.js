const xss = require('xss');

const { Comment } = require('@models/comment');
const { Article } = require('@models/article');
const { User } = require('@models/user');
const { Reply } = require('@models/reply') ;
const { isArray, unique } = require('@lib/utils');
const { Op } = require('sequelize');

class CommentDao {
  /**
   * 创建评论
   */
  static async create(v) {
    const comment = Comment.build();
    const article_id = v.get('body.article_id');
    const user_id = v.get('body.user_id');
    const articleExist = await Article.findByPk(article_id);
    const userExist = await User.findByPk(user_id);
    if (!articleExist) {
      throw new global.errs.NotFound('没有该文章id');
    }
    if (!userExist) {
      throw new global.errs.NotFound('没有该用户');
    }
    comment.article_id = article_id;
    comment.content = v.get('body.content');
    comment.user_id = user_id;

    try {
      const res = await comment.save();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 删除评论
   */
  static async delete(id) {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      throw new global.errs.NotFound('没有该评论');
    }

    try {
      const res = await comment.destroy();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 关联目标下的评论
   */
  static async targetComment(params = {}) {
    try {
      const {
        article_id,
        user_id,
        page_size = 10,
        page = 1,
        desc = 'created_at'
      } = params;

      if (!article_id) {
        throw new global.errs.NotFound('必须传入article id');
      }

      const filter = {
        article_id,
        deleted_at: null
      };

      if (user_id) {
        filter.user_id = user_id
      }

      const comment = await Comment.findAndCountAll({
        where: filter,
        limit: parseInt(page_size),
        offset: (page - 1) * page_size,
        order: [
          [desc, 'DESC']
        ],
        attributes: {
          exclude: ['updated_at', 'deleted_at', 'id']
        },
      });

      let rows = comment.rows;

      const data = {
        data: rows,
        // 分页
        meta: {
          current_page: parseInt(page),
          page_size,
          total: comment.count,
          total_page: Math.ceil(comment.count / page_size)
        }
      }
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }
}

module.exports = { CommentDao };