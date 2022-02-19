/**
 * @description 文章标签的 DAO
 */
const { ArticleLabel } = require('@models/article_label');
const { Label } = require('@models/label');

class ArticleLabelDao {
  /**
   * 给文章增加标签
   */
  static async create(params = {}) {
    const { article_id, label_id, label_name } = params;
    const exist = await ArticleLabel.findOne({
      where: {
        article_id,
        label_id
      }
    });
    if (exist) {
      throw new global.errs.Existing('该文章已有该标签');
    }

    const hasLabel = await Label.findByPk(label_id);
    if (!hasLabel) {
      throw new global.errs.NotFound('无此标签');
    }

    const articleLabel = ArticleLabel.build();
    articleLabel.article_id = article_id;
    articleLabel.label_id = label_id;
    articleLabel.label_name = hasLabel.label_name;

    try {
      const res = await articleLabel.save();
      const data = {
        article_id: res.article_id,
        label_id: res.label_id,
        label_name: res.label_name
      };
      return [null, data];
    } catch(err) {
      return [err, null];
    }
  }

  /**
   * 给文章删除标签
   */
   static async delete(data) {
    const articleLabel = await ArticleLabel.findOne({
      where: {
        article_id: data.article_id,
        label_id: data.label_id
      }
    })

    if (!articleLabel) {
      throw new global.errs.NotFound('文章没有该标签');
    }
    try {
      const res = await articleLabel.destroy();
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  /**
   * 获取文章的标签
   */
  static async list(article_id) {
    try {
      const labelList = await ArticleLabel.findAndCountAll({
        where: {
          article_id
        },
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at']
        }
      });

      const data = {
        data: labelList.rows,
        total: labelList.count
      };
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }
}

module.exports = { ArticleLabelDao };
