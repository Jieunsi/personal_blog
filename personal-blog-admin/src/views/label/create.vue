<template>
  <el-form
    class="wrap"
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="80px"
  >
    <el-form-item label="标签名称" prop="label_name">
      <el-input v-model="ruleForm.label_name" />
    </el-form-item>
    <el-form-item>
      <el-button @click="reset('ruleForm')">重置</el-button>
      <el-button type="primary" @click="submit('ruleForm')">立即创建</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { createLabel } from '@/api/label';

export default {
  name: 'LabelCreate',
  data() {
    return {
      ruleForm: {
        label_name: '',
      },
      rules: {
        label_name: [
          { required: true, message: '请输入文章标签名称', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.createLabel();
        } else {
          return false;
        }
      });
    },
    async createLabel() {
      try {
        const res = await createLabel(this.ruleForm);
        if (res.code === 200) {
          this.$msgbox
            .confirm('创建成功, 是否退出创建标签页面', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success',
            })
            .then(() => {
              this.$router.push('/label/index');
            });
        }
      } catch (err) {
        this.$message.error(err);
      }
    },

    reset(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped land='scss'>
.wrap {
  box-sizing: border-box;
  margin: 48px;
}
</style>
