<template>
  <div>
    <div class="container">
      <div class="article">
        <h1 class="title">
          {{ article.title }}
        </h1>
        <div class="info">
          <span v-if="nickname" class="author"> By {{ nickname }} </span>
          <span class="created-at">{{ article.created_at }}</span>
          <span v-if="article.category_info" class="category">
            文章分类：{{ article.category_info.sort_name }}
          </span>
        </div>
        <div class="article-content" v-html="article.content"></div>
        <div class="operate">
          <div class="operate-btn" @click="clickFavor">
            <i :class="[hasFavor ? 'el-icon-star-on' : 'el-icon-star-off']"> </i>
          </div>
          <div class="operate-btn" @click="clickLike">
            <i :class="[ hasLike ? 'iconfont icon-like-fill' : 'iconfont icon-like-icon']"> </i>
          </div>
        </div>
      </div>
    </div>
    <el-backtop></el-backtop>
    <el-dialog
      :visible.sync="isLogin"
      width="880px"
      top="0"
      :lock-scroll="true"
      :before-close="handleClose"
    >
      <LoginForm @on-success="isLogin = false" />
    </el-dialog>
    <vue-lazy-component @after-leave="onLoadEnd">
      <ArticleComment class="response-wrap" />
      <img
        width="0"
        height="0"
        style="display: none"
        src="http://cdn.jieunsi.top/background.jpg"
        alt="preload"
      />
    </vue-lazy-component>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { component as VueLazyComponent } from '@xunlei/vue-lazy-component';
import { getArticleDetail } from '@/request/api/article';
import ArticleComment from '@/components/article/ArticleComment';
import LoginForm from '@/components/common/LoginForm';
import * as likes from '@/request/api/likes';
import * as favor from '@/request/api/favor';

export default {
  name: 'ArticleDetail',
  components: {
    ArticleComment,
    VueLazyComponent,
    LoginForm,
  },
  async asyncData(context) {
    const { id } = context.query;
    const params = {
      id,
      is_markdown: true,
    };
    const [err, res] = await getArticleDetail(params);
    if (!err) {
      return {
        article: res.data.data,
      };
    }
  },
  data() {
    return {
      isLogin: false,
      hasLike: false,
      hasFavor: false,
    };
  },
  async fetch({ store }) {
    await store.dispatch('category/getCategoryData');
  },
  head() {
    const article = this.article || {};
    return {
      title: article.title,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      isLoginStatus: (state) => state.user.isLoginStatus,
    }),
    nickname() {
      if (this.article && this.article.admin_info) {
        return this.article.admin_info.nickname;
      }
      return '';
    },
  },
  beforeDestroy() {
    if (this.progress) {
      this.progress.removeProgress();
      this.progress = null;
    }
  },
  mounted() {
    this.initData();
    this.initState();
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        const ProgressIndicator = require('@/lib/progress-indicator');
        // eslint-disable-next-line no-new
        this.progress = new ProgressIndicator();
      });
    },
    async initState() {
      if (this.isLoginStatus) {
        const like = await likes.liked({
          article_id: this.$route.query.id,
          user_id: this.userInfo.id,
        });
        this.hasLike = like[1].data.data.liked;

        const _favor = await favor.hasFavorite({
          article_id: this.$route.query.id,
          user_id: this.userInfo.id,
        });
        this.hasFavor = _favor[1].data.data.hasFavorite;
      }

    },
    // 回到顶部
    scrollTop() {
      this.$scrollTo(0);
    },
    // 点击展开评论
    onLoadEnd() {
      this.$nextTick(() => {
        this.progress.calculateWidthPrecent();
      });
    },
    // 点击收藏按钮
    async clickFavor() {
      if (!this.isLoginStatus) {
        this.$message.error('请先登录');
        this.isLogin = true;
      } else {
        const type = this.hasFavor ? 'unfavorite' : 'favorite';
        const msg = this.hasFavor ? '取消收藏成功' : '收藏成功';
        await favor.favor({
          article_id: this.$route.query.id,
          user_id: this.userInfo.id,
          type,
        });
        this.$message.success(msg);
        this.hasFavor = !this.hasFavor;
      }
    },
    // 点击点赞按钮
    async clickLike() {
      if (!this.isLoginStatus) {
        this.$message.error('请先登录');
        this.isLogin = true;
      }
      else if (this.hasLike) {
        await likes.unlike({
          article_id: this.$route.query.id,
          user_id: this.userInfo.id,
        });
        this.$message.success('取消点赞成功');
        this.hasLike = !this.hasLike;
      } else {
        await likes.like({
          article_id: this.$route.query.id,
          user_id: this.userInfo.id,
        });
        this.$message.success('点赞成功');
        this.hasLike = !this.hasLike;
      }
    },
    handleClose() {
      this.isLogin = false;
    },
  },
};
</script>

<style scoped lang="scss">
ul,
li {
  margin: 0;
  padding: 0;
}
.container {
  max-width: 1170px;
  background-color: #f9f9f9;
  /* margin: 50px auto; */
  position: relative;
  margin: 0 auto 50px;
  top: 50px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 10px;
}

.article {
  box-sizing: border-box;
  width: 100%;
  max-width: 770px;
  padding: 80px 10px 10px;
  margin: 0 auto;
}

.title {
  font-size: 36px;
  font-weight: 600;
  color: #222222;
  line-height: 42px;
  text-align: center;
}

.info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 22px 0 48px;
}

.info span {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-right: 65px;

  &:last-child {
    margin-right: 0;
  }
}
.fixed-sidebar {
  cursor: pointer;
  position: fixed;
  bottom: 64px;
  right: 64px;
}

.icon {
  font-size: 40px;
}

.operate {
  display: flex;
  justify-content: center;
  border-top: 1px solid #cfcbcb;
  padding-top: 16px;
  margin: 16px 0;

  .iconfont {
    font-size: 35px;
    cursor: pointer;
    margin: 0 8px;
    color: #9e9e9e;
  }

  &-btn {
    font-size: 35px;
    margin: 0 8px;
    cursor: pointer;
    color: #9e9e9e;
  }
}

/deep/ .el-dialog__header {
  padding: 0;
}
/deep/ .el-dialog__body {
  padding: 0;
}
/deep/ .el-dialog {
  margin: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

@media screen and (max-width: 540px) {
  .article {
    margin: 32px auto 0;
  }
  .title {
    font-size: 32px;
    text-align: left;
  }
  .info {
    flex-direction: column;
    align-items: flex-start;

    & span {
      margin-right: 0;
    }
  }
}
</style>

