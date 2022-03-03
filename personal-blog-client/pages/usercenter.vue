<template>
  <div>
    <div v-if="userInfo" class="userinfo">
      <div style="margin-bottom: 16px">昵称：{{ userInfo.nickname }}</div>
      <div style="margin-bottom: 16px">邮箱：{{ userInfo.email }}</div>
      <el-button @click="logout"> 退出登录 </el-button>
      <h2>收藏文章：</h2>
      <div
        v-if="Array.isArray(favorArticleList) && favorArticleList.length > 0"
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
              <span class="article-info-title">文章标题：{{ item.title }}</span>
              <p class="article-info-time">创建时间：{{ item.created_at }}</p>
            </div>
          </li>
        </ul>
      </div>
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
              <span class="article-info-title">文章标题：{{ item.title }}</span>
              <p class="article-info-time">创建时间：{{ item.created_at }}</p>
            </div>
          </li>
        </ul>
      </div>
      <h2>评论列表：</h2>
      <div
        v-if="Array.isArray(commentList) && commentList.length > 0"
        class="comment"
      >
        <ul class="comment-list">
          <li v-for="item in commentList" :key="item.id" class="comment-item">
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getCommentTarget } from '@/request/api/comment';
import { removeToken } from '@/lib/auth';
import { getFavorArticleList } from '@/request/api/favor';
import { getLikeArticleList } from '@/request/api/likes';

export default {
  name: 'UserCenter',
  data() {
    return {
      page: 1,
      count: 0,
      commentList: [],
      likeArticleList: [],
      favorArticleList: [],
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
</style>
