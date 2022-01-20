/**
 * @description 文章的控制器
 */
const {
  ArticleValidator,
  PositiveIdParamsValidator,
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

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
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
   * 获取文章列表
   */
  static async list(ctx) {
    console.log(ctx.query, 'ctx')
    const [err, data] = await ArticleDao.list(ctx.query);
    if (!err) {
      ctx.response.status = 200;
      ctx.body = res.json(data);
    } else {
      ctx.body = res.fail(err);
    }
  }

  /**
   * 获取文章详情
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
    if (id) {
      try {
        // 查询文章详情模型
        let data = await ArticleDao.getArticleDetail(id);
        ctx.response.status = 200;
        ctx.body = {
          code: 200,
          msg: '查询成功',
          data,
        };
      } catch (err) {
        ctx.response.status = 412;
        ctx.body = {
          code: 412,
          msg: '查询失败',
          data,
        };
      }
    } else {
      ctx.response.status = 416;
      ctx.body = {
        code: 416,
        msg: '文章ID必须传',
      };
    }
  }
}

module.exports = { articleController };
