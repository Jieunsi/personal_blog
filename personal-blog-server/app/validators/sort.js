const { Rule, LinValidator } = require('@core/lin-validator');

class SortValidator extends LinValidator {
  constructor() {
    super();
    this.sort_name = [
      new Rule('isLength', '分类名称 sort_name 不能为空', { min: 1 }),
    ];
  }
}

class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule('isInt', '分类ID需要正整数', { min: 1 })];
  }
}

class UpdateValidator extends LinValidator {
  constructor() {
    super();
    this.sort_name = [
      new Rule('isLength', '分类名称 sort_name 不能为空', { min: 1 }),
    ];
    this.id = [new Rule('isInt', '分类ID需要正整数', { min: 1 })];
  }
}

module.exports = {
  SortValidator,
  PositiveIdParamsValidator,
  UpdateValidator
};
