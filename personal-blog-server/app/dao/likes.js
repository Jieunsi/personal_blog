const { Likes } = require('@models/likes');
const { Article } = require('@models/article');
const { ArticleDao } = require('@dao/article');
const { Op } = require('sequelize');

class LikesDao {
  /**
   * 点赞文章
   */
  static async like(params = {}) {
    const { article_id, user_id } = params;
    const exist = await Likes.findOne({
      where: {
        article_id,
        user_id,
      },
    });
    if (exist) {
      throw new global.errs.Existing('用户已点赞过该文章');
    }

    const likes = Likes.build();
    likes.article_id = article_id;
    likes.user_id = user_id;

    try {
      const res = await likes.save();
      await ArticleDao.updateLikes(article_id, 'like');
      const data = {
        article_id: res.article_id,
        user_id: res.user_id,
      };
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 取消点赞文章
   */
  static async unlike(params = {}) {
    const { article_id, user_id } = params;
    const like = await Likes.findOne({
      where: {
        article_id,
        user_id,
      },
    });
    if (!like) {
      throw new global.errs.NotFound('用户没有点赞过该文章');
    }

    try {
      const res = await like.destroy();
      await ArticleDao.updateLikes(article_id, 'unlike');
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 判断是否已点赞
   */
  static async liked(params = {}) {
    const { article_id, user_id } = params;
    const like = await Likes.findOne({
      where: {
        article_id,
        user_id,
      },
    });

    if (like) {
      return [null, true];
    } else {
      return [null, false];
    }
  }

  /**
   * 获取已点赞的文章
   */
  static async likeArticleList(params = {}) {
    const { user_id } = params;
    try {
      const res = await Likes.findAll({
        where: {
          user_id,
        },
        attributes: {
          exclude: ['updated_at', 'deleted_at'],
        },
      });
      const ids = res.map((item) => item.article_id);
      const articleList = await Article.findAll({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
        attributes: {
          exclude: ['updated_at', 'deleted_at'],
        },
      });
      return [null, articleList];
    } catch (err) {
      return [err, null];
    }
  }
}

module.exports = { LikesDao };
