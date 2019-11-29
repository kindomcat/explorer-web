<template>
  <div class="app-container">
    <div class="add_del_btn">
      <el-button type="primary" size="medium" @click="handlerAdd"> + 新增 </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handlerEdit">编辑</el-button>
      <el-button type="danger" size="medium" @click="handleDelete">删除</el-button>
    </div>

    <div class="area_left">
      <v-tree ref="tree" :radio="true" :data="treeData" @node-select="clickNode" />
    </div>

    <div class="area_right">
      <el-form ref="ruleForm" :rules="rules" :model="obj" label-position="left" label-width="80px" :disabled="formDisabled">
        <el-form-item label="父ID">
          <el-input v-model="obj.parentId" placeholder="请输入父ID" :disabled="true" />
        </el-form-item>
        <el-form-item v-if="obj.id >0" label="ID">
          <el-input v-model="obj.id" placeholder="请输入ID" :disabled="true" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="obj.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="obj.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="obj.type">
            <el-radio key="menu" label="menu">菜单</el-radio>
            <el-radio v-if="obj.parentId !== -1" key="button" label="button">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="obj.type==='menu'" label="图标">
          <el-input v-model="obj.icon" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item v-if="obj.type==='menu'" label="排序">
          <el-input v-model="obj.sort" placeholder="请输入排序值" />
        </el-form-item>
        <el-form-item v-if="obj.type==='button'" label="请求方式">
          <el-select v-model="obj.method" placeholder="请选择请求方式">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="obj.type==='button'" label="路径">
          <el-input v-model="obj.path" placeholder="请输入请求路径" />
        </el-form-item>
      </el-form>
      <div v-if="!formDisabled" style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
const defaultObj = {
  parentId: -1,
  id: -1,
  code: '',
  title: '',
  type: 'menu',
  sort: '',
  icon: '',
  method: '',
  path: ''
}
export default {
  data() {
    const checkMethod = (rule, value, callback) => {
      if (this.obj.type === 'button' && !value) {
        return callback(new Error('请选择请求方式'))
      } else {
        callback()
      }
    }
    const checkPath = (rule, value, callback) => {
      if (this.obj.type === 'button' && !value) {
        return callback(new Error('路径不能为空'))
      } else {
        callback()
      }
    }
    return {
      obj: Object.assign({}, defaultObj),
      treeData: [],
      formDisabled: true,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ],
        method: [
          { validator: checkMethod, trigger: 'change' }
        ],
        path: [
          { validator: checkPath, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.$service.getUserHttp('/sysMenu/tree', null).then(res => {
        if (res.rel) {
          this.treeData = res.data
        }
      })
    },
    clickNode(node) {
      this.obj = Object.assign({}, node)
      this.formDisabled = true
    },
    handlerAdd() {
      this.formDisabled = false
      const parentId = this.obj.id
      this.obj = Object.assign({}, defaultObj)
      this.obj.parentId = parentId
    },
    handlerEdit() {
      this.formDisabled = false
    },
    handleDelete() {
      if (!this.obj.id || this.obj.id < 1) {
        this.$message({ message: '请选择要删除的数据', type: 'warning' })
        return
      }
      this.$confirm('确定要删除该菜单？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if (action === 'confirm') {
            this.$service.deleteHttp('/sysMenu/' + this.obj.id, null).then(res => {
              if (res.rel) {
                this.$notify.success({ title: '成功', message: '操作成功' })
                this.initData()
                this.obj = Object.assign({}, defaultObj)
              } else {
                this.$notify.error({ title: '错误', message: res.message })
              }
            })
          }
        }
      })
    },
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.obj.id > 0) {
            this.$service.putUserHttp('/sysMenu/' + this.obj.id, null, this.obj).then(res => {
              if (res.rel) {
                this.$notify.success({ title: '成功', message: '操作成功' })
                this.initData()
                this.cancel()
              } else {
                this.$notify.error({ title: '错误', message: res.message })
              }
            })
          } else {
            this.$service.postUserHttp('/sysMenu', null, this.obj).then(res => {
              if (res.rel) {
                this.$notify.success({ title: '成功', message: '操作成功' })
                this.initData()
                this.cancel()
              } else {
                this.$notify.error({ title: '错误', message: res.message })
              }
            })
          }
        }
      })
    },
    cancel() {
      this.formDisabled = true
      this.$refs['ruleForm'].resetFields()
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
    .area_left{
      height: 850px;
      width: 30%;
      float: left;
      background: #FFFFFF;
      padding: 20px;
      margin-right: 20px;
      border-radius: 10px;
    }
    .area_right{
      width: 65%;
      min-width: 240px;
      height: 850px;
      float: left;
      border-radius: 10px;
    }
  }
</style>
