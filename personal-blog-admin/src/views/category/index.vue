<template>
  <div class="category">
    <div class="search">
      <el-form
        ref="searchForm"
        v-loading="listLoading"
        :model="searchForm"
        inline
      >
        <el-form-item label="分类ID" prop="id">
          <el-input
            v-model.trim="searchForm.id"
            placeholder="分类ID"
            class="input"
            clearable
          />
        </el-form-item>

        <el-form-item label="分类名称" prop="sort_name">
          <el-input
            v-model.trim="searchForm.sort_name"
            placeholder="分类名称"
            class="input"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="medium" @click="searchData">
            搜索
          </el-button>
          <el-button type="primary" size="medium" @click="resetSearchData">
            重置
          </el-button>
          <el-button type="primary" size="medium" @click="create">
            新增分类
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="ID" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.sort_name }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          :current-page.sync="searchForm.page"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { list, detele } from '@/api/category'
export default {
  name: 'CategoryList',
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      searchForm: {
        id: '',
        sort_name: '',
        page: 1
      }
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    // 跳转创建分类
    create() {
      this.$router.push('/category/create')
    },
    // 获取分类列表
    async getCategoryList() {
      try {
        this.listLoading = true
        const res = await list(this.searchForm)
        this.list = res.data.data
        this.total = res.data.meta.total
      } catch (err) {
        console.log(err)
      } finally {
        this.listLoading = false
      }
    },
    // 跳转分类编辑
    handleEdit(id) {
      this.$router.push('/category/edit?id=' + id)
    },
    // 删除分类
    handleDelete(id) {
      try {
        this.$msgbox
          .confirm('确定需要删除这个分类吗', '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'error'
          })
          .then(async() => {
            const r = await detele({ id })
            this.$message.success(r.msg)
            await this.getCategoryList()
          })
      } catch (err) {
        this.$message.error(err)
      }
    },
    // 搜索
    searchData() {
      this.searchForm.page = 1
      this.getCategoryList()
    },
    // 点击页码
    handleCurrentChange(page) {
      this.searchForm.page = page
      this.getCategoryList()
    },
    // 重置表单
    resetSearchData() {
      this.$refs['searchForm'].resetFields()
      this.getCategoryList()
    }
  }
}
</script>

<style scoped lang="scss">
.category {
  box-sizing: border-box;
  margin: 24px;
}
.search {
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
}
.pagination {
  display: flex;
  justify-content: right;
  margin: 24px 0;
}
</style>
