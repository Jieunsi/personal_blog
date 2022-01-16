/**
 * @description 文章的数据访问对象(Data Access Object)
 */
const { Article } = require('@models/article');

class ArticleDao {
  /**
   * 创建文章模型
   * @param data
   * @returns Promise<any>
   */
  static async createArticle(data) {
    return await Article.create({
      title: data.title,
      author: data.author,
      content: data.content,
      category: data.category,
    });
  }

  /**
   * 查询文章的详情
   * @param id 文章 ID
   */
  static async getArticleDetail(id) {
    return await Article.findOne({
      where: {
        id,
      },
    });
  }
}

module.exports = { ArticleDao };
