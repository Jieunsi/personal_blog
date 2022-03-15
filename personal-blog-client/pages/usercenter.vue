<template>
  <div>
    <div v-if="userInfo" class="userinfo">
      <div class="info">
        <img
          v-if="userInfo.img_url"
          class="avatar"
          :src="userInfo.img_url"
          alt="头像"
        />
        <div v-else class="avatar-uploader-icon">暂无头像</div>
        <div>
          <h1 style="margin-bottom: 16px">{{ userInfo.nickname }}</h1>
          <h3 style="margin-bottom: 16px">邮箱：{{ userInfo.email }}</h3>
          <h3 style="margin-bottom: 16px">
            年龄： {{ userInfo.age || '未知' }}
          </h3>
        </div>
        <el-button
          class="info-modified"
          @click="modifiedDialogVisible = true"
          type="primary"
          plain
          >修改个人资料</el-button
        >
        <el-button class="info-logout" @click="logout"> 退出登录 </el-button>
      </div>
      <el-tabs class="tabs">
        <el-tab-pane label="收藏文章">
          <h2>收藏文章：</h2>
          <div
            v-if="
              Array.isArray(favorArticleList) && favorArticleList.length > 0
            "
            class="comment"
          >
            <ul class="comment-list">
              <li
                v-for="item in favorArticleList"
                :key="item.id"
                class="article-item"
                @click="handleClickArticle(item.id)"
              >
                <div class="article-image">
                  <img :src="item.img_url" :alt="item.title" />
                </div>
                <div class="article-info">
                  <span class="article-info-title"
                    >文章标题：{{ item.title }}</span
                  >
                  <p class="article-info-time">
                    创建时间：{{ item.created_at }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="点赞文章">
          <h2>点赞文章：</h2>
          <div
            v-if="Array.isArray(likeArticleList) && likeArticleList.length > 0"
            class="comment"
          >
            <ul class="comment-list">
              <li
                v-for="item in likeArticleList"
                :key="item.id"
                class="article-item"
                @click="handleClickArticle(item.id)"
              >
                <div class="article-image">
                  <img :src="item.img_url" :alt="item.title" />
                </div>
                <div class="article-info">
                  <span class="article-info-title"
                    >文章标题：{{ item.title }}</span
                  >
                  <p class="article-info-time">
                    创建时间：{{ item.created_at }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="评论列表">
          <h2>评论列表：</h2>
          <div
            v-if="Array.isArray(commentList) && commentList.length > 0"
            class="comment"
          >
            <ul class="comment-list">
              <li
                v-for="item in commentList"
                :key="item.id"
                class="comment-item"
              >
                <p>文章：{{ item.article.title }}</p>
                <p>评论内容：{{ item.content }}</p>
                <p>评论时间：{{ item.created_at }}</p>
                <p>回复：{{ item.reply_list || '无' }}</p>
              </li>
            </ul>
            <div class="pagination">
              <el-pagination
                background
                :current-page.sync="page"
                layout="total, prev, pager, next"
                :total="count"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
          <span v-else> 暂无数据 </span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="编辑资料" :visible.sync="modifiedDialogVisible">
      <div>
        <el-form
          ref="editForm"
          :rules="rules"
          :model="modifiedForm"
          label-width="90px"
        >
          <el-form-item label="用户名" prop="nickname">
            <el-input v-model="modifiedForm.nickname" />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="modifiedForm.age" />
          </el-form-item>
          <el-form-item label="头像" prop="img_url">
            <el-upload
              class="avatar-uploader"
              action="https://upload-z2.qiniup.com/"
              :show-file-list="false"
              :data="{ token }"
              :on-success="handleUploadSuccess"
            >
              <img
                v-if="modifiedForm.img_url"
                width="80"
                height="80"
                :src="modifiedForm.img_url"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifiedDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getCommentTarget } from '@/request/api/comment';
import { removeToken } from '@/lib/auth';
import { getFavorArticleList } from '@/request/api/favor';
import { getLikeArticleList } from '@/request/api/likes';
import { getToken } from '@/request/api/upload';
import { update } from '@/request/api/user';

export default {
  name: 'UserCenter',
  data() {
    return {
      token: '',
      page: 1,
      count: 0,
      commentList: [],
      likeArticleList: [],
      favorArticleList: [],
      modifiedDialogVisible: false,
      modifiedForm: JSON.parse(JSON.stringify(this.$store.state.user.userInfo)),
      rules: {
        nickname: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
      },
    };
  },

  async fetch({ store }) {
    await store.dispatch('category/getCategoryData');
  },
  head() {
    return {
      title: `${this.userInfo && this.userInfo.nickname} - 个人中心`,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  mounted() {
    this.getComment();
    this.getArticleList();
    this.getUploadToken();
  },
  methods: {
    // 退出登录
    logout() {
      removeToken();
      this.$store.commit('user/SET_LOGIN_STATUS', false);
      this.$store.commit('user/SET_USERINFO', null);
      this.$router.push('/');
      this.$message.success('退出成功');
    },
    async getComment() {
      const uid = this.userInfo && this.userInfo.id;
      const [err, res] = await getCommentTarget({
        user_id: uid,
        is_replay: 1,
        is_article: 1,
        page: this.page,
      });
      if (!err) {
        this.isLoad = true;
        this.commentList = res.data.data.data;
        this.count = res.data.data.meta.count;
      }
    },
    async getArticleList() {
      const user_id = this.userInfo.id;
      const [, favorList] = await getFavorArticleList({
        user_id,
      });
      const [, likeList] = await getLikeArticleList({
        user_id,
      });
      this.favorArticleList = favorList.data.data;
      this.likeArticleList = likeList.data.data;
    },
    async getUploadToken() {
      try {
        const res = await getToken();
        this.token = res[1].data.data.token;
      } catch (err) {
        console.log(err);
      }
    },
    // 图片上传成功回调
    handleUploadSuccess(file) {
      this.modifiedForm.img_url = `http://cdn.jieunsi.top/${file.key}`;
      this.$message.success('上传成功!');
    },
    // 点击数字
    async handleCurrentChange(page) {
      this.page = page;
      await this.getComment();
      this.$scrollTo(0);
    },
    // 点击文章
    handleClickArticle(articleId) {
      this.$router.push(`/article?id=${articleId}`);
    },
    // 更新个人资料
    async submit() {
      try {
        await update({
          id: this.userInfo.id,
          ...this.modifiedForm,
        });
        this.$message.success('更新成功');
        await this.$store.dispatch('user/userInfo');
        this.modifiedDialogVisible = false;
        console.log(this.$store);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.userinfo {
  width: 1024px;
  margin: 0 auto 32px;
  font-size: 14px;
}
.comment-item {
  padding: 20px 0;
  border-bottom: 1px solid #e7e1e1;
}

.article {
  &-item {
    padding: 20px 0;
    border-bottom: 1px solid #e7e1e1;
    cursor: pointer;
    display: flex;
  }

  &-image {
    width: 100px;
    margin-right: 16px;
    & img {
      width: 100%;
      border-radius: 4px;
    }
  }

  &-info {
    &-title {
      font-weight: 500;
      font-size: 17px;
    }

    &-time {
      color: rgb(85, 85, 85);
    }
  }
}
.article-item:hover .article-info-title {
  color: #0164da;
}
.info {
  display: flex;
  box-sizing: border-box;
  position: relative;
  background-color: #fff;
  top: 24px;
  padding: 24px 20px 24px;
  margin-bottom: 32px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 10px;

  &-logout {
    position: absolute;
    right: 24px;
    bottom: 24px;
  }
  &-modified {
    position: absolute;
    right: 136px;
    bottom: 24px;
  }
}
.tabs {
  background-color: #fff;
  padding: 16px 20px 24px;
  position: relative;
  top: 16px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 10px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px solid #8c939d;
  border-radius: 7px;
  margin-right: 32px;
}
.avatar {
  width: 178px;
  height: 178px;
  border-radius: 7px;
  margin-right: 32px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>
