<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">添加</el-button>
    <el-table :data="tableList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Role Key" width="220">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'添加用户'">
      <el-form :model="obj" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="obj.name" placeholder="用户名称" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="obj.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="用户描述"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'

const defaultObj = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      Obj: Object.assign({}, defaultObj),
      routes: [],
      tableList: [],
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.$service.getHttp('/user-admin/page/query').then(res => {
        if (res.rel) {
          this.tableList = res.data
        }
      })
    },
    handleAdd() {
      this.obj = Object.assign({}, defaultObj)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除该用户?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.delUserHttp('/', { id: row.id }).then(res => {
          if (res.rel) {
            this.$message({ type: 'success', message: '删除成功!' })
          }
        })
      })
    },
    confirm() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        this.$service.putUserHttp('/sysUser/' + this.obj.id, null, this.obj).then(res => {
          if (res.rel) {
            this.initData()
          }
        })
      } else {
        this.$service.postUserHttp('/sysUser', null, this.obj).then(res => {
          if (res.rel) {
            this.initData()
          }
        })
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
