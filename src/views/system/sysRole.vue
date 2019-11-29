<template>
  <div class="app-container">
    <el-input v-model="listQuery.name" placeholder="角色名" style="width: 200px;" class="filter-item" @keyup.enter.native="initData" />
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="initData">搜索</el-button>
    <el-button type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
    <el-table :data="tableList" style="width: 100%;margin-top:30px;" border>
      <el-table-column
        prop="name"
        align="center"
        width="220"
        label="角色名称"
      />
      <el-table-column
        prop="description"
        align="center"
        width="220"
        label="描述"
      />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'添加'">
      <el-form ref="ruleForm" :model="obj" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="obj.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="obj.description" placeholder="描述" />
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
  username: '',
  name: '',
  password: '',
  phone: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      obj: Object.assign({}, defaultObj),
      routes: [],
      tableList: [],
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      listQuery: {
        name: ''
      },
      rules: {
        name: { required: true, message: '请输入角色名称', trigger: 'blur' },
        description: { required: true, message: '请输入描述', trigger: 'blur' }
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
      this.$service.getUserHttp('/sysRole/page/query', { username: this.listQuery.username }).then(res => {
        if (res.rel) {
          this.tableList = res.data
        }
      })
    },
    handleAdd() {
      this.obj = Object.assign({}, defaultObj)
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$refs['ruleForm'].resetFields()
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.obj = deepClone(scope.row)
      this.$refs['ruleForm'].resetFields()
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除该用户?', '提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.delUserHttp('/sysRole/del', { id: row.id }).then(res => {
          if (res.rel) {
            this.initData()
            this.$message({ type: 'success', message: '删除成功!' })
          }
        })
      })
    },
    confirm() {
      this.$refs['ruleForm'].validate((valid) => {
        const isEdit = this.dialogType === 'edit'
        if (valid) {
          if (isEdit) {
            this.$service.putUserHttp('/sysRole/' + this.obj.id, null, this.obj).then(res => {
              if (res.rel) {
                this.initData()
                this.$message({ type: 'success', message: '编辑成功!' })
              }
            })
          } else {
            this.$service.postUserHttp('/sysRole', null, this.obj).then(res => {
              if (res.rel) {
                this.initData()
                this.$message({ type: 'success', message: '添加成功!' })
              }
            })
          }
          this.dialogVisible = false
        }
      })
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
