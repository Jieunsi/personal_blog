/**
 * @description 文章的控制器
 */
const {
  ArticleValidator,
  PositiveIdParamsValidator,
  ArticleUpdateValidator,
} = require('@validators/article');
const { Auth } = require('@middlewares/auth');
const { ArticleDao } = require('@dao/article');
const { CommentDao } = require('@dao/comment');
const { Resolve } = require('@lib/helper');
const res = new Resolve();

const hljs = require('highlight.js');
const md = require('markdown-it')({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, {
            language: lang,
            ignoreIllegals: true,
          }).value +
          '</code></pre>'
        );
      } catch (__) {}
    }

    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
    );
  },
});
class articleController {
  /**
   * 创建文章
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const value = await new ArticleValidator().validate(ctx);
    const [err, data] = await ArticleDao.create(value);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('创建文章成功');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 删除文章
   */
  static async delete(ctx) {
    const v = await new PositiveIdParamsValidator().validate(ctx);

    const id = v.get('path.id');
    const [err, data] = await ArticleDao.delete(id);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('删除文章成功');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 更新文章
   */
  static async update(ctx) {
    const v = await new ArticleUpdateValidator().validate(ctx);

    const id = v.get('path.id');
    const [err, data] = await ArticleDao.update(id, v);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.success('文章更新成功');
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 获取文章列表
   */
  static async list(ctx) {
    const [err, data] = await ArticleDao.list(ctx.query);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * @description 更新点赞次数
   * @param {id}
   */
  static async like(ctx) {
    const v = await new PositiveIdParamsValidator().validate(ctx);
    const id = v.get('path.id');
    const { type } = ctx.query;
    const [err, data] = await ArticleDao.detail(id);
    if (err) {
      ctx.body = res.fail(err);
      return;
    }
    if (type == 'like') {
      var [_err, _data] = await ArticleDao.updateLikes(id, ++data.likes);
    } else {
      var [_err, _data] = await ArticleDao.updateLikes(id, --data.likes);
    }
    if (!_err) {
      ctx.response.status = 200;
      ctx.body = res.success('更新点赞次数成功');
    } else {
      ctx.body = res.fail(_err);
    }
  }

  /**
   * 获取文章详情
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    const v = await new PositiveIdParamsValidator().validate(ctx);
    const id = v.get('path.id');

    const [err, data] = await ArticleDao.detail(id);
    if (!err) {
      // 获取此文章的评论列表
      const [commentErr, commentData] = await CommentDao.targetComment({
        article_id: id,
      });
      if (!commentErr) {
        data.setDataValue('article_comment', commentData);
      }

      if (ctx.query.is_markdown) {
        data.content = md.render(data.content);
      }
      // 更新文章浏览次数
      await ArticleDao.updateViews(id, ++data.views);
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }
}

module.exports = { articleController };
