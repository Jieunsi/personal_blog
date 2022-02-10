<template>
  <section class="wrap">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="ruleForm.nickname" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')">
          重置
        </el-button>
        <el-button
          type="primary"
          @click="updateConfirm('ruleForm')"
        >
          立即更新
        </el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { updateUser, userInfo } from '@/api/user'

export default {
  name: 'UserEdit',
  data() {
    return {
      ruleForm: {
        id: this.$route.query.id,
        nickname: '',
        email: 1,
      },
      rules: {
        nickname: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.updateUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取用户信息
    async getUser() {
      try {
        const res = await userInfo({
          id: this.$route.query.id
        })
        this.ruleForm.nickname = res.data.nickname
        this.ruleForm.email = res.data.email
      } catch (err) {
        console.log(err)
      }
    },
    // 更新用户再次确认
    updateConfirm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.$msgbox
            .confirm('确定需要更新这个用户信息吗', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(async() => {
              this.updateUser('ruleForm')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 更新用户信息
    async updateUser() {
      try {
        const res = await updateUser(this.ruleForm)
        if (res.code === 200) {
          this.$msgbox
            .confirm('更新成功，是否退出更新用户页面', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            })
            .then(() => {
              this.$router.push('/user/index')
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
