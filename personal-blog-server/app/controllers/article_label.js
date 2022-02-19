/**
 * @description 文章标签控制器
 */
const {
  ArticleLabelCreateValidator,
  PositiveIdParamsValidator,
  ArticleLabelListValidator,
} = require('@validators/article_label');
const { ArticleLabelDao } = require('@dao/article_label');
const { Resolve } = require('@lib/helper');
const res = new Resolve();

class articleLabelController {
  /**
   * 给文章创建标签
   */
  static async create(ctx) {
    const v = await new ArticleLabelCreateValidator().validate(ctx);
    const article_id = v.get('body.article_id');
    const label_id = v.get('body.label_id');
    const label_name = v.get('body.label_name');
    const [err, data] = await ArticleLabelDao.create({
      article_id,
      label_id,
      label_name
    });

    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 给文章删除标签
   */
  static async delete(ctx) {
    const v = await new PositiveIdParamsValidator().validate(ctx);
    const article_id = v.get('body.article_id');
    const label_id = v.get('body.label_id')

    const [err] = await ArticleLabelDao.delete({
      article_id,
      label_id
    });
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('文章该标签已删除');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 获取某文章的标签
   */
  static async list(ctx) {
    const v = await new ArticleLabelListValidator().validate(ctx);
    const { article_id } = ctx.query;
    const [err, data] = await ArticleLabelDao.list(article_id);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }
}

module.exports = {
  articleLabelController,
};
