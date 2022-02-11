const { ReplyDao } = require('@dao/reply');
const { ReplyValidator, PositiveArticleIdParamsValidator } = require('@validators/reply');
const { Resolve } = require('@lib/helper');
const res = new Resolve();

class ReplyController {
  /**
   * 创建回复
   */
  static async create(ctx) {
    const v = await new ReplyValidator().validate(ctx);
    const [err] = await ReplyDao.create(v);

    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('回复成功');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 删除回复
   */
  static async delete(ctx) {
    const v = await new PositiveArticleIdParamsValidator().validate(ctx);
    const id = v.get('path.id');
    const [err] = await ReplyDao.delete(id);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('删除回复成功');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 修改回复
   */
  static async update(ctx) {
    const v = await new PositiveArticleIdParamsValidator().validate(ctx);
    const id = v.get('path.id');
    const [err] = await ReplyDao.update(id, v);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('更新回复成功');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 获取回复列表
   */
  static async list(ctx) {
    const [err, data] = await ReplyDao.list(ctx.query);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 获取回复详情
   */
  static async detail(ctx) {
    const v = await new PositiveArticleIdParamsValidator().validate(ctx);
    const id = v.get('path.id');

    const [err, data] = await ReplyDao.detail(id);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }
}

module.exports = { ReplyController };
