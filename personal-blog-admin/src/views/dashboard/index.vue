<template>
  <div class="dashboard-container">
    <div class="dashboard-text">毕业设计: 个人博客系统后台管理系统</div>
    <div class="title">管理员名称: {{ name }}</div>
    <div>点击左侧菜单</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 16px;
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    margin-bottom: 16px;
  }
}
</style>
