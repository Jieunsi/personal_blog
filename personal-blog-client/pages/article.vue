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
      </div>
      <div class="fixed-sidebar">
        <div class="fixed-scroll-top">
          <i class="el-icon-top icon" @click="scrollTop"></i>
        </div>
      </div>
    </div>

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

export default {
  name: 'ArticleDetail',
  components: {
    ArticleComment,
    VueLazyComponent,
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
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        const ProgressIndicator = require('@/lib/progress-indicator');
        // eslint-disable-next-line no-new
        this.progress = new ProgressIndicator();
      });
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
  margin: 50px auto;
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

