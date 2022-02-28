<template>
  <section class="wrap">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>
      <el-form-item label="图片" prop="img_url">
        <el-input v-model="ruleForm.img_url" />
      </el-form-item>
      <el-form-item label="图片" prop="img_url">
        <el-upload
          class="avatar-uploader"
          action="https://upload-z2.qiniup.com/"
          :show-file-list="false"
          :data="{ token }"
          :on-success="handleUploadSuccess"
        >
          <img
            v-if="ruleForm.img_url"
            width="80"
            height="80"
            :src="ruleForm.img_url"
            class="avatar"
          >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="分类" prop="sort_id">
        <el-select v-model="ruleForm.sort_id" placeholder="请选择分类">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.sort_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <mavon-editor
          ref="md"
          v-model="ruleForm.content"
          code-style="atom-one-dark"
          @imgAdd="$imgAdd"
          @imgDel="$imgDel"
        />
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
import { mapState } from 'vuex'
import { detail, update } from '@/api/article'
import { list } from '@/api/category'
import { getToken } from '@/api/upload'
import axios from 'axios'

export default {
  name: 'ArticleEdit',
  data() {
    return {
      token: '',
      categoryList: [],
      ruleForm: {
        id: this.$route.query.id,
        title: '',
        img_url: '',
        author_id: '',
        sort_id: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        img_url: [
          { required: true, message: '请输入图片链接', trigger: 'blur' }
        ],
        sort_id: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      adminInfo: (state) => state.admin.adminInfo
    })
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.$axios = axios.create({ withCredentials: false }) // 好像没用
      this.getArticleDetail()
      this.getUploadToken()
      this.getCategoryList()
    },
    // 获取上传token
    async getUploadToken() {
      try {
        const res = await getToken()
        this.token = res.data.token
      } catch (err) {
        console.log(err)
      }
    },
    // 获取文章详情
    async getArticleDetail() {
      try {
        const res = await detail({
          id: this.$route.query.id,
          is_markdown: false
        })
        this.ruleForm.title = res.data.title
        this.ruleForm.img_url = res.data.img_url
        this.ruleForm.content = res.data.content
        this.ruleForm.sort_id = res.data.category_info.id
        this.ruleForm.content = res.data.content
        this.ruleForm.author_id =
          (this.adminInfo && this.adminInfo.id) || res.data.adminInfo.id
      } catch (err) {
        console.log(err)
      }
    },
    // 图片上传成功回调
    handleUploadSuccess(file) {
      this.ruleForm.img_url = `http://cdn.jieunsi.top/${file.key}`
      this.$message.success('上传成功!')
    },
    $imgDel(pos, $file) {
      console.log(pos, $file)
    },
    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      // 第一步.将图片上传到服务器.
      const formdata = new FormData()
      formdata.append('file', $file)
      formdata.append('token', this.token)
      this.$axios({
        url: 'https://upload-z2.qiniup.com/',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        const img_url = `http://cdn.jieunsi.top/${res.data.key}`
        this.$refs.md.$img2Url(pos, img_url)
        loading.close()
      }).catch(err => {
        console.log(err)
        loading.close()
      })
    },
    // 获取分类列表
    async getCategoryList() {
      try {
        this.listLoading = true
        const res = await list()
        this.categoryList = res.data.data
      } catch (err) {
        console.log(err)
      } finally {
        this.listLoading = false
      }
    },
    // 提交表单
    submitForm(formName) {
      // 发布者id
      if (this.adminInfo) {
        this.ruleForm.admin_id = this.adminInfo.id
      }
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.updateArticle()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 更新文章
    async updateArticle() {
      try {
        const res = await update(this.ruleForm)
        if (res.code === 200) {
          this.$msgbox
            .confirm('更新成功，是否退出更新文章页面', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            })
            .then(() => {
              this.$router.push('/article/index')
            })
        }
      } catch (err) {
        this.$message.error(err)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.wrap {
  box-sizing: border-box;
  margin: 24px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
