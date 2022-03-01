const { Favor } = require('@models/favor');
const { Article } = require('@models/article');
const { Op } = require('sequelize');

class FavorDao {
  /**
   * 收藏/取消收藏文章
   */
  static async favor(body = {}) {
    const { article_id, user_id, type } = body;
    const exist = await Favor.findOne({
      where: {
        article_id,
        user_id,
      },
    });
    if (type === 'favorite') {
      if (exist) {
        throw new global.errs.Existing('用户已收藏过该文章');
      }
      const favor = Favor.build();
      favor.article_id = article_id;
      favor.user_id = user_id;

      try {
        await favor.save();
        return [null];
      } catch (err) {
        return [err];
      }
    } else if (type === 'unfavorite') {
      if (!exist) {
        throw new global.errs.NotFound('用户没有收藏过该文章');
      }

      try {
        await exist.destroy();
        return [null];
      } catch (err) {
        return [err];
      }
    }
  }

  /**
   * 判断是否已点赞
   */
  static async hasFavor(params = {}) {
    const { article_id, user_id } = params;
    const favor = await Favor.findOne({
      where: {
        article_id,
        user_id,
      },
    });

    if (favor) {
      return [null, true];
    } else {
      return [null, false];
    }
  }

  /**
   * 获取已点赞的文章
   */
  static async favorArticleList(params = {}) {
    const { user_id } = params;
    try {
      const res = await Favor.findAll({
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

module.exports = { FavorDao };
