const xss = require('xss');

const { Comment } = require('@models/comment');
const { Article } = require('@models/article');
const { User } = require('@models/user');
const { Reply } = require('@models/reply') ;
const { isArray, unique } = require('@lib/utils');
const { Op } = require('sequelize');

class CommentDao {
  /**
   * 创建评论
   */
  static async create(v) {
    const comment = Comment.build();
    const article_id = v.get('body.article_id');
    const user_id = v.get('body.user_id');
    const articleExist = await Article.findByPk(article_id);
    const userExist = await User.findByPk(user_id);
    if (!articleExist) {
      throw new global.errs.NotFound('没有该文章id');
    }
    if (!userExist) {
      throw new global.errs.NotFound('没有该用户');
    }
    comment.article_id = article_id;
    comment.content = v.get('body.content');
    comment.user_id = user_id;

    try {
      const res = await comment.save();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 删除评论
   */
  static async delete(id) {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      throw new global.errs.NotFound('没有该评论');
    }

    try {
      const res = await comment.destroy();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 获取评论详情
   */
  static async detail(id, query) {
    const { is_reply = 0, is_article = 0, is_user = 0} = query;
    try {
      let comment = await Comment.scope('iv').findOne({
        where: {
          id,
          deleted_at: null
        },
        attributes: {
          exclude: ['updated_at']
        }
      });
      if (!comment) {
        throw new global.errs.NotFound('没有找到该评论的信息');
      }

      console.log(comment.toJSON());
      if (is_reply == 1) {
        comment = await CommentDao._handleReply(comment);
      }

      if (is_article == 1) {
        comment = await CommentDao._handleArticle(comment);
      }

      if (is_user == 1) {
        comment = await CommentDao._handleUser(comment);
      }

      return [null, comment];
    } catch (err) {
      console.log(err, 'err');
      return [err, null];
    }
  }

  /**
   * 更新评论
   */
  static async update(id, v) {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      throw new global.errs.NotFound('没有找到相关评论');
    }
    const aid = v.get('body.article_id');
    const uid = v.get('body.user_id');
    const content = v.get('body.content');
    if (aid) {
      comment.article_id = aid;
    }
    if (uid) {
      comment.user_id = uid;
    }
    if (content) {
      comment.content = content;
    }

    try {
      const res = await comment.save();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

   /**
   * 获取评论列表
   */
    static async list(query) {
      const {
        page = 1,
        is_reply = 0,
        is_article = 0,
        is_user = 0,
        content,
        id,
        article_id,
      } = query;

      try {
        const filter = {
          deleted_at: null
        }
        
        if (id) {
          filter.id = id;
        }
        if (article_id) {
          filter.article_id = article_id;
        }
        if (content) {
          filter.content = {
            [Op.like]: `%${content}%`
          }
        }

        const pageSize = 10;
        const comment = await Comment.scope('bh').findAndCountAll({
          limit: pageSize,
          offset: (page - 1) * pageSize,
          where: filter,
          order: [
            ['created_at', 'DESC']
          ],
          attributes: {
            exclude: ['updated_at']
          }
        });

        let rows = comment.rows;

        if (is_reply == 1) {
          rows = await CommentDao._handleReply(rows);
        }
        if (is_article == 1) {
          rows = await CommentDao._handleArticle(rows);
        }
        if (is_user == 1) {
          rows = await CommentDao._handleUser(rows);
        }

        const data = {
          data: rows,
          meta: {
            current_page: parseInt(page),
            per_page: 10,
            count: comment.count,
            total: comment.count,
            total_page: Math.ceil(comment.count / 10)
          }
        };
        return [null, data];
      } catch (err) {
        return [err, null];
      }
    }

  /**
   * 关联目标下的评论
   */
  static async targetComment(params = {}) {
    try {
      const {
        article_id,
        user_id,
        is_reply = 0,
        is_article = 0,
        is_user = 0,
        page_size = 10,
        page = 1,
        desc = 'created_at'
      } = params;

      // if (!article_id) {
      //   throw new global.errs.NotFound('必须传入article id');
      // }

      const filter = {
        // article_id,
        deleted_at: null
      };

      if (user_id) {
        filter.user_id = user_id;
      }
      if (article_id) {
        filter.article_id = article_id;
      }

      const comment = await Comment.findAndCountAll({
        where: filter,
        limit: parseInt(page_size),
        offset: (page - 1) * page_size,
        order: [
          [desc, 'DESC']
        ],
        attributes: {
          exclude: ['updated_at', 'deleted_at']
        },
      });

      let rows = comment.rows;
      if (is_reply == 1) {
        rows = await CommentDao._handleReply(rows);
      }
      if (is_article == 1) {
        rows = await CommentDao._handleArticle(rows);
      }
      if (is_user == 1) {
        rows = await CommentDao._handleUser(rows);
      }

      const data = {
        data: rows,
        // 分页
        meta: {
          current_page: parseInt(page),
          page_size,
          count: comment.count,
          total: comment.count,
          total_page: Math.ceil(comment.count / page_size)
        }
      }
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 查询回复id, 并处理数据为 map 格式
   * @param ids 评论id
   * @return 回复数据
   */
  static async getReplyData(ids) {
    const scope = 'bh';
    const filter = {
      where: {
        deleted_at: null
      },
      attributes: ['id', 'content', 'comment_id', 'article_id', 'user_id', 'reply_user_id', 'created_at']
    }
    const isArrayIds = isArray(ids);

    if (isArrayIds) {
      filter.where.comment_id = {
        [Op.in]: ids
      }
    } else if (ids) {
      filter.where.comment_id = ids
    }

    try {
      const fn = isArrayIds ? 'findAll' : 'findOne';
      const res = await Reply.scope(scope)[fn](filter);

      if (isArrayIds) {
        const reply = {};
        // 将 Reply 数组拆分为 map 结构
        res.forEach(item => {
          // 已有该 comment_id
          if (reply[item.comment_id]) {
            reply[item.comment_id].push(item);
          } else {
          // 该评论的第一条回复
            reply[item.comment_id] = [item]
          }
        });
        return [null, reply];
      }

      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 查询文章id, 并处理数据为 map 格式
   * @param ids 文章id
   * @return 文章数据
   */
  static async getArticleData(ids) {
    const scope = 'bh';
    const filter =  {
      where: {},
      attributes: ['id', 'title']
    };
    const isArrayIds = isArray(ids);
    if (isArrayIds) {
      filter.where.id = {
        [Op.in]: ids
      }
    } else if (ids) {
      filter.where.id = ids
    }

    try {
      if (isArrayIds) {
        const res = await Article.scope(scope).findAll(filter);
        const article = {};
        res.forEach(item => {
          article[item.id] = item
        });
        return [null, article];
      } else {
        const res = await Article.scope(scope).findOne(filter);
        return [null, res];
      }
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 查询用户id, 并处理数据为 map 格式
   * @param ids 用户id
   * @return 用户数据
   */
  static async getUserData(ids) {
    if (ids === 0) {
      return [null, null];
    }

    const scope = 'bh';
    const filter = {
      where: {
        id: {}
      }
    };
    const isArrayIds = isArray(ids);
    if (isArrayIds) {
      filter.where.id = {
        [Op.in]: ids
      }
    } else if (ids) {
      filter.where.id = ids
    }

    try {
      const fn = isArrayIds ? 'findAll' : 'findOne';
      const res = await User.scope(scope)[fn](filter);

      if (isArrayIds) {
        const user = {};
        res.forEach(item => {
          user[item.id] = item
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
   * @param comment 评论数据
   * @param data 需要设置的数据
   * @param id 评论表和设置数据的关联id
   * @param key 新增设置评论下的属性 key
   * @returns 新的评论数据
   * @private
   */
   static _setCommentByDataValue(comment, data = {}, id = 'id', key = 'key') {
    // 处理数组和对象的情况
    if (isArray(comment)) {
      // 查询数据列表的id是否有匹配的 map key: 如 reply[commentItem.id]
      // 有直接赋值，反之默认数组
      comment.forEach(commentItem => {
        commentItem.setDataValue(key, data[commentItem[id]] || null)
      })
    } else {
      comment.setDataValue(key, data)
    }

    return comment;
  }

  /**
   * 处理评论下的回复
   * @param comment 评论数据 Array | Object
   * @return 新的评论数据
   */
  static async _handleReply(comment) {
    try {
      const isArrayData = isArray(comment);
      const commentIds = isArrayData ? unique(comment.map(v => v.id)) : comment.id;
      // 获取该评论下的回复
      const [replyErr, replyData] = await CommentDao.getReplyData(commentIds);

      if (!replyErr) {
        const userIds = [];
        let newUserIds = [];
        
        if (isArrayData) {
          Object.keys(replyData).forEach(key => {
            // key 是 comment_id
            userIds.push(
              ...replyData[key].map(item => item.user_id),
              ...replyData[key].map(item => item.reply_user_id)
            )
          });
        } else {
          userIds.push(replyData.user_id, replyData.reply_user_id);
        }
        // 参与到评论的用户的id
        newUserIds = unique(userIds).filter(v => v !== 0);

        const [userErr1, userData1] = await CommentDao.getUserData(newUserIds);
        if (!userErr1) {
          CommentDao._handleReplyUserInfo(replyData, userData1);
        }

        return CommentDao._setCommentByDataValue(comment, replyData, 'id', 'reply_list');
      } else {
        throw new global.errs.Existing(JSON.stringify(replyErr));
      }
    } catch(err){}
  }

  static _handleReplyUserInfo(data, user = {}) {
    try {
      const USER_INFO = 'user_info';
      const REPLY_USER_INFO = 'reply_user_info';
      Object.keys(data).forEach(key => {
        // key 是 comment_id
        const item = data[key]
        // item 评论下的回复数据
        if (isArray(item)) {
          item.forEach(v => {
            v.setDataValue(USER_INFO, user[v.user_id] || null)
            v.setDataValue(REPLY_USER_INFO, user[v.reply_user_id] || null)
          })
        } else {
          if (item.user_id) {
            item[USER_INFO] = user[item.user_id] || null
          }
          if (item.reply_user_id) {
            item[REPLY_USER_INFO] = user[item.reply_user_id] || null
          }
        }
      })

      return data
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * 处理评论下的管理文章
   * @param comment 评论数据 Array | Object
   * @returns 新的评论数据
   * @private
   */
   static async _handleArticle(comment) {
    // 判断评论数据是否是数组或者对象
    // 如果是数组，遍历去到评论下的文章id列表
    // 如果是对象，直接取该评论的id
    const isArrayData = isArray(comment)
    const articleIds = isArrayData ? unique(comment.map(c => c.article_id)) : comment.article_id

    // 进行查询
    const [articleErr, articleData] = await CommentDao.getArticleData(articleIds)

    if (!articleErr) {
      return CommentDao._setCommentByDataValue(comment, articleData, 'article_id', 'article')
    } else {
      throw new global.errs.Existing(JSON.stringify(articleErr));
    }
  }

  /**
   * 处理评论下的用户
   * @param comment 评论数据 Array | Object
   * @returns 新的评论数据
   * @private
   */
  static async _handleUser(comment) {
    // 判断评论数据是否是数组或者对象
    // 如果是数组，遍历去到评论下的文章id列表
    // 如果是对象，直接取该评论的id
    const isArrayData = isArray(comment)
    const userIds = isArrayData
      ? unique(comment.map(c => c.user_id)).filter(v => v !== 0)
      : comment.user_id

    // 进行查询
    const [userErr, userData] = await CommentDao.getUserData(userIds)

    if (!userErr) {
      return CommentDao._setCommentByDataValue(comment, userData, 'user_id', 'user_info')

    } else {
      throw new global.errs.Existing(JSON.stringify(userErr));
    }
  }
}

module.exports = { CommentDao };