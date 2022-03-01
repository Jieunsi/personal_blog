<template>
  <div>
    <ul
      v-if="article && article.data && article.data.length > 0"
      class="response-wrap article"
    >
      <li v-for="item in article.data" :key="item.id" class="article-list">
        <a
          :href="`/article?id=${item.id}`"
          class="article-item"
          @click="(e) => jumpURL(e, item.id)"
        >
          <div class="article-image">
            <img :src="item.img_url" :alt="item.title" />
          </div>
          <div class="article-item-content">
            <h1 class="article-title">{{ item.title }}</h1>
            <div class="article-category">
              分类: {{ item.category_info ? item.category_info.sort_name : '' }}
            </div>
            <div class="gray-color article-label mt1">
              文章标签:
              <span v-if="item.label_info">
                <el-tag
                  v-for="label in item.label_info"
                  :key="label.label_id"
                  size="small"
                  class="article-tag"
                >
                  {{ label.label_name }}
                </el-tag>
              </span>
              <span v-else>暂无</span>
            </div>
            <span class="el-icon-view gray-color mt1 mr2">
              {{ item.views }}
            </span>
            <i class="iconfont icon-like-icon gray-color mr2">
              {{ item.likes }}
            </i>
            <span class="el-icon-date gray-color">
              {{ item.created_at }}
            </span>
            <!-- <span
              :class="[
                like ? 'el-icon-star-on' : `el-icon-star-off`,
                'view-icon',
              ]"
              @click.stop.prevent="updateLike"
            >
              {{ item.likes }}
            </span> -->
          </div>
        </a>
      </li>
    </ul>
    <div v-else class="empty-data">
      暂无数据
      <a v-if="isClear" href="/">清空搜索条件</a>
    </div>
    <div v-if="isLoad" class="response-wrap more" @click="loadMore">
      <div class="more-text">点击加载更多</div>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getArticleList, updateLikes } from '@/request/api/article';
export default {
  name: 'IndexPage',
  async asyncData(context) {
    const { id, keyword, sort_id, page = 1 } = context.query;

    const [err, res] = await getArticleList({
      id,
      sort_id,
      keyword,
      page,
    });
    if (!err) {
      const isLoad = res.data.data.meta.total_pages > page;
      return {
        // eslint-disable-next-line camelcase
        isClear: !!keyword || !!sort_id,
        page,
        isLoad,
        sortId: sort_id,
        article: res.data.data,
      };
    }
  },

  data() {
    return {
      like: false,
    };
  },

  async fetch({ store }) {
    await store.dispatch('category/getCategoryData');
  },

  head() {
    return {
      title: '个人博客系统 - 毕业设计',
    };
  },

  computed: {
    ...mapState({
      categoryList: (state) => state.category.categoryList,
    }),
    // 数据是否为空
    isEmptyData() {
      return (
        this.article &&
        Array.isArray(this.article.data) &&
        this.article.data.length === 0
      );
    },
  },

  methods: {
    jumpURL(e, id) {
      e.preventDefault();
      this.$router.push(`/article?id=${id}`);
    },

    async fetchData(id) {
      const [err, res] = await getArticleList({
        sort_id: id,
        page: this.page,
      });
      if (!err) {
        this.sortId = id;
        this.article.data.push(...res.data.data.data);
        this.isLoad = res.data.data.meta.total_pages > this.page;
      }
    },
    // 加载更多
    loadMore() {
      this.page++;
      this.fetchData();
    },

    async updateLike() {
      const type = this.like ? 'unlike' : 'like';
      this.like = !this.like;
      await updateLikes({
        type,
      });
    },
  },
};
</script>

<style scoped lang="scss">
/*文章*/
.article-list {
  box-sizing: border-box;
  display: block;
  clear: both;
  padding: 32px 0;
  border-bottom: 1px solid #f0f0f0;
}

.article-list:hover .article-title {
  color: #0164da;
}

.article-item {
  display: flex;
  height: 100%;
  width: 100%;
  text-decoration: none;
  -webkit-transition: background-color 0.35s, color 0.35s, margin 0.45s,
    -webkit-transform 0.5s;
  transition: background-color 0.35s, color 0.35s, margin 0.45s, transform 0.5s;
}

.article-image {
  width: 100px;
  & img {
    width: 100%;
    border-radius: 4px;
  }
}

.article-item-content {
  padding-left: 24px;
  /* flex: 1; */
  /* display: flex;
  flex-direction: column;
  justify-content: space-between; */
}

.article-title {
  font-weight: bold;
  font-size: 25px;
  color: rgb(85, 85, 85);
  padding: 0;
  margin: 0;
}

.article-description {
  font-size: 14px;
  color: #404040;
  margin: 12px 0 24px;
}

.article-category {
  font-size: 14px;
  color: #808080;
  margin-top: 4px;
}

.empty-data {
  padding: 80px 0;
  text-align: center;
  font-size: 14px;
}

.more {
  cursor: pointer;
  padding: 32px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.more-text {
  font-size: 16px;
  font-weight: 400;
  color: #222222;
  line-height: 22px;
}
.more-arrow {
  width: 16px;
  margin-top: 24px;
}
.more-arrow img {
  width: 100%;
}

.view-icon {
  margin-top: 16px;
  margin-right: 16px;
}

.gray-color {
  color: #808080;
}

.article {
  &-label {
    font-size: 14px;
  }

  &-tag {
    margin: 0 4px;
  }
}

@media screen and (max-width: 540px) {
  .article-list {
    padding: 24px 0;
  }

  .article-image {
    width: 90px;
  }
}

.mt1 {
  margin-top: 8px;
}

.mt2 {
  margin-top: 16px;
}
.mr2 {
  margin-right: 16px;
}
</style>
