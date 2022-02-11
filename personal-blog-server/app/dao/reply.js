const xss = require('xss');
const { Reply } = require('@models/reply');
const { User } = require('@models/user');
const { Comment } = require('@models/comment');
const { Article } = require('@models/article');
const { isArray, unique } = require('@lib/utils');
const { Op } = require('sequelize');

class ReplyDao {
  /**
   * 创建回复
   */
  static async create(v) {
    const hasComment = await Comment.findByPk(v.get('body.comment_id'));
    if (!hasComment) {
      throw new global.errs.NotFound('没有该评论');
    }

    const reply = Reply.build();
    // reply.reply_id = v.get('body.reply_id');
    reply.content = v.get('body.content');
    reply.comment_id = v.get('body.comment_id');
    reply.article_id = v.get('body.article_id');
    reply.user_id = v.get('body.user_id');
    reply.reply_user_id = v.get('body.reply_user_id');

    try {
      const res = await reply.save();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 删除回复
   */
  static async delete(id) {
    const reply = await Reply.findByPk(id);
    if (!reply) {
      throw new global.errs.NotFound('没有该评论');
    }
    try {
      const res = await reply.destroy();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 获取回复详情
   */
  static async detail(id) {
    try {
      const reply = await Reply.scope('iv').findOne({
        where: {
          id,
          deleted_at: null,
        },
        attributes: {
          exclude: ['created_at']
        }
      });

      if (!reply) {
        throw new global.errs.NotFound('没有该回复');
      }

      return [null, reply];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 更新回复
   */
  static async update(id, v) {
    const reply = await Reply.findByPk(id);
    if (!reply) {
      throw new global.errs.NotFound('没有该回复');
    }

    const content = v.get('body.content');
    if (content) {
      reply.content = xss(content);
    }

    try {
      const res = await reply.save();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 处理回复下的文章
   * @param reply 评论数据 Array | Object
   * @returns 新的评论数据
   * @private
   */
  static async _handleArticle(reply) {
    // 判断评论数据是否是数组或者对象
    // 如果是数组，遍历去到评论下的文章id列表
    // 如果是对象，直接取该评论的id
    const isArrayData = isArray(reply);
    const articleIds = isArrayData
      ? unique(reply.map((c) => c.article_id))
      : reply.article_id;

    // 进行查询
    const [articleErr, articleData] = await ReplyDao.getArticleData(articleIds);

    if (!articleErr) {
      return ReplyDao.setReplyByDataValue(
        reply,
        articleData,
        'article_id',
        'article'
      );
    } else {
      throw new global.errs.Existing(JSON.stringify(articleErr));
    }
  }

  /**
   * 处理回复下的用户
   * @param reply 评论数据 Array | Object
   * @returns 新的评论数据
   * @private
   */
  static async _handleUser(reply) {
    // 判断评论数据是否是数组或者对象
    // 如果是数组，遍历去到评论下的文章id列表
    // 如果是对象，直接取该评论的id
    const isArrayData = isArray(reply);
    const userIds = isArrayData
      ? unique(reply.map((c) => c.user_id)).filter((v) => v !== 0)
      : reply.user_id;

    // 进行查询
    const [userErr, userData] = await ReplyDao.getUserData(userIds);

    if (!userErr) {
      return ReplyDao.setReplyByDataValue(
        reply,
        userData,
        'user_id',
        'user_info'
      );
    } else {
      throw new global.errs.Existing(JSON.stringify(userErr));
    }
  }

  /**
   * 查询用户id，且处理数据为 key-value 形式
   * @param ids 用户id | Array | Object
   * @returns 根据传入的ids查询出来的用户数据
   */
  static async getUserData(ids) {
    if (ids === 0) {
      return [null, null];
    }

    const scope = 'bh';
    const filter = {
      where: {
        id: {},
      },
    };
    const isArrayIds = isArray(ids);
    // 如果ids是数组，则使用 Op.in 查询
    if (isArrayIds) {
      filter.where.id = {
        [Op.in]: ids,
      };
    } else if (ids) {
      // 反之id索引查询
      filter.where.id = ids;
    }

    try {
      // 如果ids是数组，则使用 Op.in 查询，反之id索引查询
      const fn = isArrayIds ? 'findAll' : 'findOne';
      const res = await User.scope(scope)[fn](filter);

      if (isArrayIds) {
        const user = {};
        res.forEach((item) => {
          user[item.id] = item;
        });
        return [null, user];
      }

      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 新增设置评论下的属性
   *
   * @param reply 评论数据
   * @param data 需要设置的数据
   * @param id 评论表和设置数据的关联id
   * @param key 新增设置评论下的属性 key
   * @returns 新的评论数据
   * @private
   */
  static setReplyByDataValue(reply, data = {}, id = 'id', key = 'key') {
    // 处理数组和对象的情况
    if (isArray(reply)) {
      // 查询数据列表的id是否有匹配的 map key: 如 reply[replyItem.id]
      // 有直接赋值，反之默认数组
      reply.forEach((replyItem) => {
        replyItem.setDataValue(key, data[replyItem[id]] || null);
      });
    } else {
      reply.setDataValue(key, data);
    }

    return reply;
  }

  /**
   * 查询文章id，且处理数据为 key-value 形式
   * @param ids 文章id | Array | Object
   * @returns 根据传入的ids查询出来的文章数据
   */
  static async getArticleData(ids) {
    const scope = 'bh';
    const filter = {
      where: {},
      attributes: ['id', 'title'],
    };
    const isArrayIds = isArray(ids);
    // 如果ids是数组，则使用 Op.in 查询
    if (isArrayIds) {
      filter.where.id = {
        [Op.in]: ids,
      };
    } else if (ids) {
      // 反之id索引查询
      filter.where.id = ids;
    }

    try {
      // 如果ids是数组，则使用 Op.in 查询，反之id索引查询
      if (isArrayIds) {
        const res = await Article.scope(scope).findAll(filter);
        const article = {};
        res.forEach((item) => {
          // 如果有重复的map key 则直接装进去
          if (article[item.id]) {
            article[item.id].push(item);
          } else {
            // 反之，初始化数组
            article[item.id] = [item];
          }
        });
        return [null, article];
      } else {
        const res = await Article.scope(scope).findOne(filter);

        return [null, res];
      }
    } catch (err) {
      console.log(err);
      return [err, null];
    }
  }

  // 回复列表
  static async list(query) {
    try {
      const {
        page = 1,
        is_user = 0,
        is_article = 0,
        content,
        id,
        article_id,
      } = query;

      let filter = {};

      if (id) {
        filter.id = id;
      }
      if (article_id) {
        filter.article_id = article_id;
      }

      if (content) {
        filter.content = {
          [Op.like]: `%${content}%`,
        };
      }

      const res = await Reply.findAndCountAll({
        where: filter,
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['deleted_at', 'updated_at'] },
      });
      let reply = res.rows;

      if (is_article == 1) {
        reply = await ReplyDao._handleArticle(reply);
      }

      if (is_user == 1) {
        reply = await ReplyDao._handleUser(reply);
      }

      const data = {
        data: reply,
        meta: {
          current_page: parseInt(page),
          per_page: 10,
          count: res.count,
          total: res.count,
          total_pages: Math.ceil(res.count / 10),
        },
      };
      return [null, data];
    } catch (err) {
      console.log(err);
      return [err, null];
    }
  }
}

module.exports = { ReplyDao };
