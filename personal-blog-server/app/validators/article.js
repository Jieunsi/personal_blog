const { Rule, LinValidator } = require('@core/lin-validator');
const { Sort } = require('@models/sort');

class ArticleValidator extends LinValidator {
  constructor() {
    super();
    this.title = [new Rule('isLength', '文章标题 title 不能为空', { min: 1 })];
    this.author_id = [new Rule('isLength', '作者id author_id 不能为空', { min: 1 })];
    this.img_url = [
      new Rule('isLength', '文章封面 img_url 不能为空', { min: 1 }),
    ];
    this.content = [
      new Rule('isLength', '文章内容 content 不能为空', { min: 1 }),
    ];
    this.sort_id = [
      new Rule('isLength', '文章分类 sort_id 不能为空', { min: 1 }),
    ];
  }

  async validateSortId(values) {
    const sortId = values.body.sort_id;

    const sort = await Sort.findOne({
      where: {
        id: sortId,
      },
    });

    if (!sort) {
      throw new Error('暂无此分类ID');
    }
  }
}

class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule('isInt', '文章ID需要正整数', { min: 1 })];
  }
}

class ArticleUpdateValidator extends LinValidator {
  constructor() {
    super();
    this.title = [new Rule('isLength', '文章标题 title 不能为空', { min: 1 })];
    this.author_id = [new Rule('isLength', '作者id author_id 不能为空', { min: 1 })];
    this.img_url = [
      new Rule('isLength', '文章封面 img_url 不能为空', { min: 1 }),
    ];
    this.content = [
      new Rule('isLength', '文章内容 content 不能为空', { min: 1 }),
    ];
    this.sort_id = [
      new Rule('isLength', '文章分类 sort_id 不能为空', { min: 1 }),
    ];
    this.id = [new Rule('isInt', '文章ID需要正整数', { min: 1 })];
  }

  async validateSortId(values) {
    const sortId = values.body.sort_id;

    const sort = await Sort.findOne({
      where: {
        id: sortId,
      },
    });

    if (!sort) {
      throw new Error('暂无此分类ID');
    }
  }
}

class ArticleSearchValidator extends LinValidator {
  constructor() {
    super();
    this.keyword = [new Rule('isLength', '必须传入搜索关键字', { min: 1 })];
  }
}

module.exports = {
  ArticleValidator,
  PositiveIdParamsValidator,
  ArticleSearchValidator,
  ArticleUpdateValidator
};
