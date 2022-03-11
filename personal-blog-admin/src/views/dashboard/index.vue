<template>
  <div class="dashboard-container">
    <div class="dashboard-text">毕业设计: 个人博客系统后台管理系统</div>
    <div class="dashboard-title">管理员名称: {{ name }}</div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-eye">
            <span class="el-icon-view" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">文章总阅读数:</div>
            <div class="card-panel-num">340</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-like">
            <span class="el-icon-thumb" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">文章总点赞数:</div>
            <div class="card-panel-num">9</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-post">
            <span class="el-icon-date" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">本月发文数:</div>
            <div class="card-panel-num">7</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-total">
            <span class="el-icon-edit" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总发文数:</div>
            <div class="card-panel-num">8</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <div style="width: 300px" class="card-panel">
      各分类文章:
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name']),
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 16px;
}
.dashboard {
  &-container {
    margin: 30px;
    padding: 32px;
    background-color: #fff;
    /* min-height: calc(100vh - 110px); */
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    margin-bottom: 16px;
    text-align: center;
  }
  &-title {
    text-align: center;
    color: #666;
  }
}
.panel-group {
  margin-top: 18px;
}
.card-panel {
  height: 108px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  &:hover {
    .card-panel-icon-wrapper {
      color: #fff;
    }
    .icon-eye {
      background: #40c9c6;
    }
    .icon-post {
      background: #36a3f7;
    }
    .icon-like {
      background: #f4516c;
    }
    .icon-total {
      background: #34bfa3;
    }
  }
  .icon-eye {
    color: #40c9c6;
    font-size: 45px;
  }
  .icon-post {
    color: #36a3f7;
    font-size: 45px;
  }
  .icon-like {
    font-size: 45px;
    color: #f4516c;
  }
  .icon-total {
    font-size: 45px;
    color: #34bfa3;
  }
  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }
  .card-panel-icon {
    float: left;
    font-size: 48px;
  }
  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;
    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }
    .card-panel-num {
      font-size: 20px;
    }
  }
}
</style>
