/**
 * @description 文章标签的 DAO
 */
const { ArticleLabel } = require('@models/article_label');

class ArticleLabelDao {
  static async getArticleLabel() {
    return await ArticleLabel.findOne({
      where: {
        id
      }
    })
  }
}

module.exports = { ArticleLabelDao };
