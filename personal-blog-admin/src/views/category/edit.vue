<template>
  <section class="wrap">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="名称" prop="sort_name">
        <el-input v-model="ruleForm.sort_name" />
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >立即更新</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { update, detail } from '@/api/category'

export default {
  name: 'CategoryEdit',
  data() {
    return {
      ruleForm: {
        id: this.$route.query.id,
        sort_name: '',
      },
      rules: {
        sort_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      }
    }
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.updateCategory()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取分类信息
    async getCategory() {
      try {
        const res = await detail({
          id: this.$route.query.id
        })
        this.ruleForm.sort_name = res.data.sort_name
      } catch (err) {
        console.log(err)
      }
    },
    // 更新分类
    async updateCategory() {
      try {
        const res = await update(this.ruleForm)
        if (res.code === 200) {
          this.$msgbox
            .confirm('更新成功，是否退出更新分类页面', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            })
            .then(() => {
              this.$router.push('/category/index')
            })
        }
      } catch (err) {
        this.$message.error(err)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.wrap {
  box-sizing: border-box;
  margin: 24px;
}
</style>
