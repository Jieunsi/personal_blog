const { Rule, LinValidator } = require('@core/lin-validator');

class LikesCreateValidator extends LinValidator {
  constructor() {
    super();
    this.article_id = [
      new Rule('isLength', '文章id article_id 不能为空', { min: 1 }),
    ];
    this.user_id = [
      new Rule('isLength', '标签ID user_id 不能为空', { min: 1 }),
    ];
  }
}

class LikeArticleListValidator extends LinValidator {
  constructor() {
    super();
    this.user_id = [
      new Rule('isLength', '文章id user_id 不能为空', { min: 1 }),
    ];
  }
}


class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule('isInt', 'ID需要正整数', { min: 1 })];
  }
}

module.exports = {
  LikesCreateValidator,
  PositiveIdParamsValidator,
  LikeArticleListValidator
};
