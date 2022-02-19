const { LabelCreateValidator, PositiveIdParamsValidator} = require('@validators/label');
const { LabelDao } = require('@dao/label');
const { Resolve } = require('@lib/helper');
const res = new Resolve();

class LabelController {
  /**
   * 创建标签
   */
  static async create(ctx) {
    const v = await new LabelCreateValidator().validate(ctx);
    const [err, data] = await LabelDao.create(v.get('body.label_name'));
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 删除标签
   */
  static async delete(ctx) {
    const v = await new PositiveIdParamsValidator().validate(ctx);
    const id = v.get('path.id');

    const [err] = await LabelDao.delete(id);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('删除标签成功');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 获取标签列表
   */
  static async list(ctx) {
    const [err, data] = await LabelDao.list();
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 更新某个标签
   */
  static async update(ctx) {
    const v = await new PositiveIdParamsValidator().validate(ctx);

    const id = v.get('path.id');
    const [err] = await LabelDao.update(id, v);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('更新标签成功');
    } else {
      ctx.body = res.fail(err);
    }
  }
}

module.exports = { LabelController };
