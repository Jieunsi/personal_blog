const {
  FavorArticleListValidator,
  FavorCreateValidator,
  judgeFavorValidator
} = require('@validators/favor');
const { FavorDao } = require('@dao/favor');
const { Resolve } = require('@lib/helper');
const res = new Resolve();

class favorController {
  /**
   * 收藏/取消收藏文章
   */
  static async favor(ctx) {
    const v = await new FavorCreateValidator().validate(ctx);
    const article_id = v.get('body.article_id');
    const user_id = v.get('body.user_id');
    const type = v.get('body.type');
    const [err] = await FavorDao.favor({
      article_id,
      user_id,
      type,
    });

    if (!err) {
      ctx.response.status = 200;
      if (type === 'favorite') {
        ctx.body = res.success('收藏成功');
      } else if (type === 'unfavorite') {
        ctx.body = res.success('取消收藏成功');
      }
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 判断是否已经点赞
   */
  static async hasFavorite(ctx) {
    await new judgeFavorValidator().validate(ctx);
    const { article_id, user_id } = ctx.query;
    const [err, data] = await FavorDao.hasFavor({
      article_id,
      user_id,
    });
    if (err) {
      ctx.body = res.fail(err);
    } else if (data) {
      ctx.response.status = 200;
      ctx.body = res.json({ hasFavorite: true });
    } else {
      ctx.response.status = 200;
      ctx.body = res.json({ hasFavorite: false });
    }
  }

  /**
   * 获取已点赞的文章
   */
  static async favorArticleList(ctx) {
    await new FavorArticleListValidator().validate(ctx);
    const { user_id } = ctx.query;
    const [err, data] = await FavorDao.favorArticleList({
      user_id,
    });
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }
}

module.exports = {
  favorController,
};
