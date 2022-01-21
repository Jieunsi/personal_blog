/**
 * @description 文章的数据访问对象(Data Access Object)
 */
const { Op } = require('sequelize');
const { Article } = require('@models/article');
const { Sort } = require('@models/sort');
const { Comment } = require('@models/comment');
const { Admin } = require('@models/admin');
const { isArray, unique } = require('@lib/utils');

class ArticleDao {
  /**
   * 创建文章
   * @param v
   * @returns Promise<any>
   */
  static async create(v) {
    const title = v.get('body.title');
    const hasArticle = await Article.findOne({
      where: {
        title,
        deleted_at: null,
      },
    });
    if (hasArticle) {
      throw new global.errs.Existing('文章标题已存在');
    }

    const article = Article.build();
    article.title = title;
    article.author_id = v.get('body.author_id');
    article.img_url = v.get('body.img_url');
    article.content = v.get('body.content');
    article.sort_id = v.get('body.sort_id');

    try {
      const res = await article.save();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  static async _handleAuthor(data, ids) {
    const finner = {
      where: {
        id: {},
      },
      attributes: ['id', 'email', 'nickname'],
    };

    if (isArray(ids)) {
      finner.where.id = {
        [Op.in]: ids,
      };
    } else {
      finner.where.id = ids;
    }

    try {
      if (isArray(ids)) {
        const res = await Admin.findAll(finner);
        let admin = {};
        res.forEach((item) => {
          admin[item.id] = item;
        });

        data.forEach((item) => {
          item.setDataValue('admin_info', admin[item.author_id] || null);
        });
      } else {
        const res = await Admin.findOne(finner);
        data.setDataValue('admin_info', res);
      }
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }

  static async _handleSort(data, ids) {
    // data: 文章数组, ids: 分类数组
    const finner = {
      where: {
        id: {},
      },
      attributes: ['id', 'sort_name'],
    };
    if (isArray(ids)) {
      finner.where.id = {
        [Op.in]: ids,
      };
    } else {
      finner.where.id = ids;
    }

    try {
      if (isArray(ids)) {
        // 找到所有分类的分类信息
        const res = await Sort.findAll(finner);
        let category = {};
        // 将分类信息添加到category中
        res.forEach((item) => {
          category[item.id] = item;
        });

        data.forEach((item) => {
          item.setDataValue(
            'category_info',
            category[item.sort_id] || null
          );
        });
      } else {
        const res = await Sort.findOne(finner);
        data.setDataValue('category_info', res);
      }
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 获取文章列表
   * @param {}
   * @returns
   */
  static async list(params = {}) {
    const { sort_id, keyword, page_size = 10, page = 1 } = params;

    // 过滤条件
    let filter = {
      deleted_at: null,
    };

    // 选择了分类
    if (sort_id) {
      filter.sort_id = sort_id;
    }
    // 输入了搜索关键字
    if (keyword) {
      filter.title = {
        [Op.like]: `%${keyword}%`,
      };
    }
    try {
      const article = await Article.scope('iv').findAndCountAll({
        limit: parseInt(page_size), //默认每页十条
        offset: (page - 1) * page_size,
        where: filter,
        order: [['created_at', 'DESC']],
      });

      let rows = article.rows;
      // 获取分类
      const sortIds = unique(
        rows.map((item) => {
          return item.sort_id;
        })
      );

      // rows传的是引用值
      const [sortErr, dataAndSort] = await ArticleDao._handleSort(
        rows,
        sortIds
      );
      if (!sortErr) {
        rows = dataAndSort;
      }
      // 处理作者
      const authorIds = unique(rows.map((item) => item.author_id));
      const [userErr, dataAndAuthor] = await ArticleDao._handleAuthor(
        rows,
        authorIds
      );
      if (!userErr) {
        rows = dataAndAuthor;
      }

      const data = {
        data: rows,
        // 分页
        meta: {
          current_page: parseInt(page),
          per_page: 10,
          count: article.count,
          total: article.count,
          total_pages: Math.ceil(article.count / page_size),
        },
      };
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * @description 删除文章
   * @param  id 
   * @returns [err, data] 
   */
  static async delete(id) {
    const article = await Article.findOne({
      where: {
        id,
        deleted_at: null
      }
    });
    if (!article) {
      throw new global.errs.NotFound('没有找到该文章');
    }

    try {
      const res = article.destroy();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * @description 更新文章
   * @param  id , v 
   * @returns 
   */
  static async update(id, v) {
    const article = await Article.findOne({
      where: {
        id,
        deleted_at: null
      }
    });
    if (!article) {
      throw new global.errs.NotFound('没有此文章');
    }
    article.title = v.get('body.title');
    article.author_id = v.get('body.author_id');
    article.img_url = v.get('body.img_url');
    article.content = v.get('body.content');
    article.sort_id = v.get('body.sort_id');
    
    try {
      const res = await article.save();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * @description 更新文章浏览次数
   * @param {id, views} 
   */
  static async updateViews(id, views) {
    const article = await Article.findByPk(id);
    if (!article) {
      throw new global.errs.NotFound('没有找到相关文章');
    }
    article.views = views;

    try {
      const res = await article.save();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * @description 更新文章点赞次数
   * @param {id, likes} 
   */
   static async updateLikes(id, likes) {
    const article = await Article.findByPk(id);
    if (!article) {
      throw new global.errs.NotFound('没有找到相关文章');
    }
    article.likes = likes;

    try {
      const res = await article.save();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 查询文章的详情
   * @param id 文章 ID
   */
  static async detail(id) {
    try {
      let filter = {
        id,
        deleted_at: null
      };

      let article = await Article.findOne({
        where: filter,
      });

      // rows传的是引用值
      await ArticleDao._handleSort(
        article,
        article.sort_id
      );
      // if (!sortErr) {
      //   article = dataAndSort;
      // }
      // 处理作者
      await ArticleDao._handleAuthor(
        article,
        article.author_id
      );
      // if (!userErr) {
      //   rows = dataAndAuthor;
      // }
      
      if (!article) {
        throw new global.errs.NotFound('没有该文章');
      }

      const comment = await Comment.findAndCountAll({
        where: {
          article_id: id,
          deleted_at: null
        },
        attributes: ['id']
      });

      if (comment) {
        article.setDataValue('comment_count', comment.count || 0);
      }

      return [null, article];
    } catch (err) {
      return [err, null];
    }
  }
}

module.exports = { ArticleDao };
