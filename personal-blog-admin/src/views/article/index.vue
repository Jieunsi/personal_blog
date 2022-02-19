<template>
  <div class="category">
    <div class="search">
      <el-form
        ref="searchForm"
        v-loading="listLoading"
        :model="searchForm"
        inline
      >
        <el-form-item label="文章ID" prop="id">
          <el-input
            v-model.trim="searchForm.id"
            placeholder="文章ID"
            class="input"
            clearable
          />
        </el-form-item>

        <el-form-item label="分类" prop="category_id">
          <el-select v-model="searchForm.category_id" placeholder="请选择分类">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.sort_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model.trim="searchForm.title"
            placeholder="文章名称"
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
            新增文章
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
        <el-table-column label="文章标题" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="文章图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.img_url" width="80" height="80" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="作者" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.admin_info.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">
            {{ scope.row.category_info.sort_name }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>
        <el-table-column label="文章喜欢数量" align="center">
          <template slot-scope="scope">
            {{ scope.row.likes }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          width="250px"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEditLabel(scope.row.id)"
              >文章标签</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          :current-page.sync="searchForm.page"
          layout="total, prev, pager, next"
          :total="count"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog title="编辑文章标签" :visible.sync="editFormVisible">
      <div>
        <span class="label-title">当前标签: </span>
        <span v-if="articleLabelList.length !== 0">
          <el-tag class="tag" v-for="label in articleLabelList" :key="label.id">
            {{ label.label_name }}
          </el-tag>
        </span>
        <span v-else class="label-title">暂无</span>
        <div class="label-list">
          <span > 标签列表: </span>
          <el-select clearable ref="select" style="margin-left: 8px" v-model="selectLabel">
            <el-option
              v-for="item in labelList"
              :key="item.id"
              :label="item.label_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="addLabel">添加标签</el-button>
        <el-button type="danger" @click="deleteLabel">删除标签</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, detele } from '@/api/article';
import { list as getCategoryList } from '@/api/category';
import * as articleLabel from '@/api/article-label';
import { labelList } from '@/api/label';

export default {
  name: 'ArticleList',
  data() {
    return {
      categoryList: [],
      list: null,
      listLoading: true,
      count: 0,
      searchForm: {
        id: '',
        title: '',
        page: 1,
        category_id: '',
      },
      editFormVisible: false,
      editingArticleId: 0,
      articleLabelList: [],
      labelList: [],
      selectLabel: null
    };
  },
  mounted() {
    this.getArticleList();
    this.getCategoryList();
    this.getArticleLabelList();
  },
  methods: {
    create() {
      this.$router.push('/article/create');
    },
    // 获取分类列表
    async getCategoryList() {
      try {
        this.listLoading = true;
        const res = await getCategoryList();
        this.categoryList = res.data.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.listLoading = false;
      }
    },
    // 获取文章列表
    async getArticleList() {
      try {
        this.listLoading = true;
        const res = await list(this.searchForm);
        this.list = res.data.data;
        this.count = res.data.meta.count;
      } catch (err) {
        console.log(err);
      } finally {
        this.listLoading = false;
      }
    },
    // 获取标签列表
    async getArticleLabelList() {
      try {
        const res = await labelList();
        this.labelList = res.data.data;
      } catch (err) {}
    },
    // 添加标签
    async addLabel() {
      try {
        await articleLabel.createArticleLabel({
          article_id: this.editingArticleId,
          label_id: this.selectLabel
        });
        this.$message.success('添加标签成功');
        this.editFormVisible = false;
        this.$refs.select.clear();
      } catch (err) {
        console.log(err);
      }
    },
    async deleteLabel() {
      try {
        await articleLabel.deleteArticleLabel({
          id: this.editingArticleId,
          article_id: this.editingArticleId,
          label_id: this.selectLabel
        });
        this.$message.success('删除标签成功');
        this.$refs.select.clear;
        this.editFormVisible = false;
      } catch (err) {
        console.log(err);
      }
    },

    // 文章编辑
    handleEdit(id) {
      this.$router.push('/article/edit?id=' + id);
    },
    // 删除文章
    handleDelete(id) {
      try {
        this.$msgbox
          .confirm('确定需要删除这个文章吗', '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'error',
          })
          .then(async () => {
            const r = await detele({ id });
            this.$message.success(r.msg);
            await this.getArticleList();
          });
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 编辑文章标签
    async handleEditLabel(id) {
      try {
        const res = await articleLabel.getArticleLabelList({ article_id: id });
        this.articleLabelList = res.data.data;
        this.editFormVisible = true;
        this.editingArticleId = id;
      } catch (err) {
        console.log(err);
      }
    },
    // 搜索
    searchData() {
      this.searchForm.page = 1;
      this.getArticleList();
    },
    // 点击页码
    handleCurrentChange(page) {
      this.searchForm.page = page;
      this.getArticleList();
    },
    // 重置表单
    resetSearchData() {
      this.$refs['searchForm'].resetFields();
      this.getArticleList();
    },
  },
};
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
.label-title {
  font-size: 16px;
  font-weight: 500;
}
.tag {
  margin-left: 8px;
}
.label-list {
  font-size: 16px;
  font-weight: 500;
  margin-top: 16px;
}
</style>
