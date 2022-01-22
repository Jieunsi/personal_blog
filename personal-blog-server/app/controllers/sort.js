const { SortValidator, PositiveIdParamsValidator, UpdateValidator } = require('@validators/sort');
const { SortDao } = require('@dao/sort');
const { Resolve} = require('@lib/helper');
const res = new Resolve();

class SortController {
  /**
   * 创建分类
   */
  static async create(ctx) {
    const v = await new SortValidator().validate(ctx);
    const [err, data] = await SortDao.create({
      sort_name: v.get('body.sort_name'),
      parent_id: v.get('body.parent_id')
    });

    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 删除分类
   */
  static async delete(ctx) {
    const v = await new PositiveIdParamsValidator().validate(ctx);

    const id = v.get('path.id');
    const [err] = await SortDao.delete(id);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('删除该分类成功');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 更新分类
   */
  static async update(ctx) {
    const v = await new UpdateValidator().validate(ctx);

    const id = v.get('path.id');
    const [err] = await SortDao.update(id, v);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('更新分类成功');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 获取分类列表
   */
  static async list(ctx) {
    const [err, data] = await SortDao.list(ctx.query);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }
}

module.exports = { SortController };
