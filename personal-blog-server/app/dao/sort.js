const { Sort } = require('@models/sort');
const { Op } = require('sequelize');

class SortDao {
  /**
   * 创建分类
   */
  static async create(params = {}) {
    const { sort_name, parent_id = 0 } = params;
    // 是否重复
    const exist = await Sort.findOne({
      where: {
        sort_name,
        deleted_at: null
      }
    });

    if (exist) {
      throw new global.errs.Existing('该分类已存在');
    }

    const sort = Sort.build();
    sort.sort_name = sort_name;
    sort.parent_id = parent_id;

    try {
      const res = await sort.save();
      const data = {
        sort_name: res.sort_name,
        key: res.key,
        parent_id: res.parent_id,
        msg: '创建成功'
      }
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 删除分类
   */
  static async delete(id) {
    const sort = await Sort.findByPk(id);
    if (!sort) {
      throw new global.errs.NotFound('没有此分类');
    }
    try {
      const res = await sort.destroy();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 更新分类
   */
  static async update(id, v) {
    const sort = await Sort.findByPk(id);
    if (!sort) {
      throw new global.err.NotFound('没有该分类');
    }
    sort.sort_name = v.get('body.sort_name');
    sort.parent_id = v.get('body.parent_id');

    try {
      const res = sort.save();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 获取分类列表
   */
  static async list(query = {}) {
    const {
      sort_name,
      id,
      page_size = 10,
      page = 1
    } = query;
    const filter = {}
    if (sort_name) {
      filter.sort_name = {
        [Op.like]: `%${sort_name}%`
      }
    }
    if (id) {
      filter.id = id
    }
    
    try {
      const sort = await Sort.scope('bh').findAndCountAll({
        where: filter,
        limit: parseInt(page_size),
        offset: (page - 1) * page_size,
        order: [
          ['created_at', 'DESC']
        ]
      });

      const data = {
        data: sort.rows,
        meta: {
          current_page: page,
          total: sort.count,
          total_pages: Math.ceil(sort.count / page_size)
        }
      }
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }
}

module.exports = { SortDao };
