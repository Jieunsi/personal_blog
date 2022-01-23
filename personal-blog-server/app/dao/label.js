const { Label } = require('@models/label');

class LabelDao {
  /**
   * 创建标签
   */
  static async create(label_name) {
    const exist = await Label.findOne({
      where: {
        label_name,
      },
    });

    if (exist) {
      throw new global.errs.Existing('该标签已存在');
    }

    const label = Label.build();
    label.label_name = label_name;

    try {
      const res = await label.save();
      const data = {
        label_name: res.label_name,
        msg: '标签创建成功',
      };
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 删除标签
   */
  static async delete(id) {
    const label = await Label.findByPk(id);

    if (!label) {
      throw new global.errs.NotFound('没有该标签');
    }
    try {
      const res = await label.destroy();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 获取标签列表
   */
  static async list() {
    try {
      const label = await Label.findAndCountAll({
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at']
        }
      });

      const data = {
        data: label.rows,
        total: label.count
      };
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }
}

module.exports = { LabelDao };
