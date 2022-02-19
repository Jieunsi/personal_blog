<template>
  <div class="label">
    <div class="search">
      <el-form
        ref="searchForm"
        v-loading="listLoading"
        :model="searchForm"
        inline
      >
        <el-form-item label="标签ID" prop="id">
          <el-input
            v-model.trim="searchForm.id"
            placeholder="标签ID"
            clearable
          />
        </el-form-item>
        <el-form-item label="标签名称" prop="label_name">
          <el-input
            v-model.trim="searchForm.label_name"
            placeholder="标签名称"
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
            新增标签
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="ID" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="标签名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.label_name }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        background
        :current-page.sync="searchForm.page"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
    <el-dialog title="编辑标签" :visible.sync="editDialogVisible">
      <div>
        <!-- <span class="title">标签名:</span>
        <el-input
          ref="input"
          class="input"
          v-model="editedLabel"
          :placeholder="originLabel.label_name"
        /> -->
        <el-form ref="editForm" :rules="rules" :model="editForm" label-width="90px">
          <el-form-item label="标签名称" prop="label_name">
            <el-input ref="input" v-model="editForm.label_name" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitEdit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { labelList, deleteLabel, updateLabel } from '@/api/label';

export default {
  name: 'LabelList',
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      searchForm: {
        id: '',
        label_name: '',
        page: 1,
      },
      editDialogVisible: false,
      editForm: {
        label_name: ''
      },
      originLabel: {},
      rules: {
        label_name: [
          {
            required: true,
            message: '请输入文章标签名称',
            trigger: 'blur',
          },
        ],
      },
    };
  },

  mounted() {
    this.getLabelList();
  },

  methods: {
    create() {
      this.$router.push('/label/create');
    },

    async getLabelList() {
      try {
        this.listLoading = true;
        const res = await labelList(this.searchForm);
        this.list = res.data.data;
        this.total = res.data.total;
      } catch (err) {
        console.log(err);
      } finally {
        this.listLoading = false;
      }
    },

    handleEdit(item) {
      // this.$router.push(`/label/edit?id=${id}`);
      this.editDialogVisible = true;
      this.originLabel = item;
    },

    async handleSubmitEdit() {
      try {
        this.$refs.editForm.validate(async (valid) => {
          if (valid) {
            const res = await updateLabel({
              id: this.originLabel.id,
              label_name: this.editForm.label_name,
            });
            this.$message.success('更新成功');
            this.$refs.input.clear();
            this.editDialogVisible = false;
            this.getLabelList();
          } else {
            return false;
          }
        });
      } catch (err) {
        console.log(err);
      }
    },

    handleDelete(id) {
      try {
        this.$msgbox
          .confirm('确定需要删除这个标签吗', '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(async () => {
            const res = await deleteLabel({ id });
            this.$message.success(res.msg);
            await this.getLabelList();
          });
      } catch (e) {
        this.$message.error(e);
      }
    },

    searchData() {
      this.searchForm.page = 1;
      this.getLabelList();
    },

    handlePageChange(page) {
      this.searchForm.page = page;
      this.getLabelList();
    },

    resetSearchData() {
      this.$refs['searchForm'].resetFields();
      this.getLabelList();
    },
  },
};
</script>

<style scoped lang="scss">
.label {
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

.input {
  width: 90%;
}

.title {
  font-size: 16px;
  font-weight: 500;
  margin-right: 8px;
}
</style>
