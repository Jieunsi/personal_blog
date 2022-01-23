const { Rule, LinValidator } = require('@core/lin-validator');

class ArticleLabelCreateValidator extends LinValidator {
  constructor() {
    super();
    this.article_id = [
      new Rule('isLength', '文章id article_id 不能为空', { min: 1 }),
    ];
    this.label_id = [
      new Rule('isLength', '标签ID label_id 不能为空', { min: 1 }),
    ];
  }
}

class ArticleLabelListValidator extends LinValidator {
  constructor() {
    super();
    this.article_id = [
      new Rule('isLength', '文章id article_id 不能为空', { min: 1 }),
    ];
  }
}


class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule('isInt', '文章的标签ID需要正整数', { min: 1 })];
  }
}

module.exports = {
  ArticleLabelCreateValidator,
  PositiveIdParamsValidator,
  ArticleLabelListValidator
};
