const { Rule, LinValidator } = require('@core/lin-validator');

class LabelCreateValidator extends LinValidator {
  constructor() {
    super();
    this.label_name = [
      new Rule('isLength', '标签名称 label_name 不能为空', { min: 1 }),
    ];
  }
}

class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule('isInt', '分类ID需要正整数', { min: 1 })];
  }
}

module.exports = {
  LabelCreateValidator,
  PositiveIdParamsValidator,
};
