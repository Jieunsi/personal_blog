const { CommentDao } = require('@dao/comment');
const {
  CreateCommentValidator,
  PositiveArticleIdParamsValidator,
} = require('@validators/comment');
const { Resolve } = require('@lib/helper');
const res = new Resolve();

class CommentController {
  /**
   * 创建评论
   */
  static async create(ctx) {
    const v = await new CreateCommentValidator().validate(ctx);
    const [err, data] = await CommentDao.create(v);
    if (!err) {
      const _data = {
        id: data.id,
        content: data.content,
        article_id: data.article_id,
        user_id: data.user_id,
        created_at: data.created_at
      };
      ctx.response.status = 200;
      ctx.body = res.json(_data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 删除评论
   */
  static async delete(ctx) {
    const v = await new PositiveArticleIdParamsValidator().validate(ctx);
    const id = v.get('path.id');
    const [err] = await CommentDao.delete(id);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('删除评论成功');
    } else {
      ctx.body = res.fail(err);
    }
  }
}

module.exports = { CommentController };
