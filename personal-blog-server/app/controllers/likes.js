const {
  LikeArticleListValidator,
  LikesCreateValidator,
} = require('@validators/likes');
const { LikesDao } = require('@dao/likes');
const { Resolve } = require('@lib/helper');
const res = new Resolve();

class likesController {
  /**
   * 点赞文章
   */
  static async like(ctx) {
    const v = await new LikesCreateValidator().validate(ctx);
    const article_id = v.get('body.article_id');
    const user_id = v.get('body.user_id');
    const [err, data] = await LikesDao.like({
      article_id,
      user_id,
    });

    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 取消点赞文章
   */
  static async unlike(ctx) {
    const v = await new LikesCreateValidator().validate(ctx);
    const article_id = v.get('body.article_id');
    const user_id = v.get('body.user_id');
    const [err] = await LikesDao.unlike({
      article_id,
      user_id,
    });

    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('取消点赞成功');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 判断是否已经点赞
   */
  static async liked(ctx) {
    const v = await new LikesCreateValidator().validate(ctx);
    const { article_id, user_id } = ctx.query;
    const [err, data] = await LikesDao.liked({
      article_id,
      user_id,
    });
    if (err) {
      ctx.body = res.fail(err);
    } else if (data) {
      ctx.response.status = 200;
      ctx.body = res.json({ liked: true });
    } else {
      ctx.response.status = 200;
      ctx.body = res.json({ liked: false });
    }
  }

  /**
   * 获取已点赞的文章
   */
  static async likeArticleList(ctx) {
    const v = await new LikeArticleListValidator().validate(ctx);
    const { user_id } = ctx.query;
    const [err, data] = await LikesDao.likeArticleList({
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
  likesController,
};
