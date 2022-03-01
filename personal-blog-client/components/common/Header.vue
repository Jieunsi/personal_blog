<template>
  <div>
    <div class="header">
      <div class="response-wrap header-inner">
        <a class="logo" href="/"></a>
        <div class="nav">
          <div
            v-for="(item, index) in nav"
            :key="index"
            :class="[
              'nav-item',
            ]"
            @click="jumpURL(item.router)"
          >
            {{ item.title }}
          </div>
          <div v-if="Array.isArray(categoryList) && categoryList.length">
            <el-dropdown>
              <span class="el-dropdown-link">
                分类<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in categoryList" :key="item.id">
                  <a class="category-links" :href="'/?sort_id=' + item.id">{{
                    item.sort_name
                  }}</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <a
            href="https://github.com/Jieunsi/personal_blog"
            target="_blank"
            class="nav-item"
          >
            Github
          </a>
        </div>
        <div class="search">
          <el-input
            v-model="keyword"
            size="small"
            :clearable="true"
            placeholder="请输入文章标题"
            prefix-icon="el-icon-search"
            @keyup.enter.native="onSearch"
          >
          </el-input>
        </div>
        <div
          v-if="isLoginStatus"
          class="nav-item"
          @click="jumpURL('/usercenter')"
        >
          个人中心
        </div>
        <el-button v-else type="text" class="login" @click="login = true"
          >登录 / 注册</el-button
        >
      </div>
    </div>

    <el-dialog
      :visible.sync="login"
      width="880px"
      top="0"
      :lock-scroll="true"
      :before-close="handleClose"
    >
      <LoginForm @on-success="login = false" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LoginForm from '@/components/common/LoginForm';

export default {
  name: 'VHeader',
  components: {
    LoginForm,
  },
  props: {
    isCategory: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      keyword: '',
      navIndex: 0,
      nav: [
        {
          title: '首页',
          router: '/',
        },
      ],
      login: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      isLoginStatus: (state) => state.user.isLoginStatus,
      categoryList: (state) => state.category.categoryList,
    }),
  },
  watch: {
    isLoginStatus: {
      handler() {
        this.handleNav();
      },
    },
  },
  mounted() {
    this.handleNav();
    this.getCategory();
  },
  methods: {
    getCategory() {
      this.$store.dispatch('category/getCategoryData');
    },
    onSearch() {
      if (!this.keyword) return false;
      window.location.href = `/?keyword=${this.keyword}`;
    },
    handleNav() {
      if (this.isLoginStatus) {
        this.login = false;
      }
    },
    handleClose() {
      this.login = false;
    },
    // 返回首页
    goHome() {
      window.location.href = '/';
    },
    // 跳转URL
    jumpURL(router) {
      const { sort_id, keyword } = this.$route.query;
      if (sort_id || keyword) {
        window.location.href = router;
      } else {
        this.$router.push(router);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  border-bottom: 1px solid #f0f0f0;
}
.header-inner {
  box-sizing: border-box;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  cursor: pointer;
  box-sizing: border-box;
  display: block;
  width: 40px;
  height: 40px;
  background: url('../../static/logo.png') center center no-repeat;
  background-size: 40px;
}
.nav {
  box-sizing: border-box;
  flex: 1;
  height: 56px;
  display: flex;
  margin: 0 64px;
  align-items: center;
}
.nav-item {
  box-sizing: border-box;
  height: 56px;
  line-height: 56px;
  padding: 0 32px;
  white-space: nowrap;
  cursor: pointer;
  display: block;
  text-align: center;
  font-size: 16px;
  color: #222222;
  text-decoration: none;
  &-active {
    color: #2d8cf0;
  }

  &:hover {
    color: #2d8cf0;
  }
}

.el-dropdown-link {
  cursor: pointer;
  font-size: 16px;
  padding: 0 32px;
  color: #222222;
  white-space: nowrap;

  &:hover {
    color: #2d8cf0;
  }

  &:hover .el-icon-arrow-down {
    color: #2d8cf0;
  }
}
.el-icon-arrow-down {
  font-size: 16px;
  color: #222222;
}

.category-links {
  box-sizing: border-box;
  display: block;
  height: 100%;
  width: 100%;
  color: #222222;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    color: #2d8cf0;
  }
}

.search {
  cursor: pointer;
}

.login {
  color: #222222;
  margin: 0 24px;
  font-size: 15px;
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
  .nav {
    display: none;
  }
  .search {
    flex: 1;
    margin-left: 24px;
  }
}
</style>
