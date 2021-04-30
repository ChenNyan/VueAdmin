<template>
<div class="users">
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input
            placeholder="请输入内容"
            v-model="userParams.query"
            class="input-with-select"
            clearable
            @clear="clearKey"
        >
          <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchClick"
              :disabled="userParams.query.length <= 0"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addUserClick">添加用户</el-button>
      </el-col>
    </el-row>

    <el-table :data="userList" style="width: 100%" border>
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="username" label="姓名"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_name" label="角色"> </el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-switch v-model="row.mg_state" @change="changeUserStatus(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template #default="{ row }">
          <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUserClick(row)"
          ></el-button>
          <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deluser(row)"
          ></el-button>
          <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="roleclick(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        :page-sizes="[2, 3, 5, 10]"
        :page-size="userParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="userParams.pagenum"
    >
    </el-pagination>
  </el-card>
<usersdialog ref="dialog" @clearCurrentUserInfo="clearCurrentUserInfo" :currentUserInfo="currentUserInfo"></usersdialog>
  <roledialog ref="roledialog" :roleInfo="roleInfo" :rolesList="rolesList"></roledialog>
</div>
</template>

<script>
import {getuser,deluser,getrolelist,changeuserstatus} from "@/network/api";
import Usersdialog from "@/components/Usersdialog";
import Roledialog from "@/components/Roledialog";

export default {
  name: "Users",
  components: {Roledialog, Usersdialog},
  data(){
    return {
      userParams:{query:'', pagenum: 1, pagesize: 2 },
      userList:[],
      totalPage:0,
      currentUserInfo:{},
      roleInfo:{},
      rolesList:[]
    }
  },
  created() {
    this.getUser()
    this.getrole()
  },
  methods:{
    async getUser(){
      const {meta,data} = await getuser(this.userParams)
      if(meta.status!==200) return this.$message.error(meta.msg)
      this.totalPage = data.total
      this.userList = data.users
    },
    sizeChange(size) {
      this.userParams.pagesize = size
      this.getUser()
    },
    currentChange(page){
      this.userParams.pagenum = page
      this.getUser()
    },
    clearKey(){
      this.userParams.pagenum=1
      this.getUser()
    },
    searchClick(){
      this.userParams.pagenum = 1
      this.getUser()
    },
    addUserClick(){
      this.currentUserInfo={}
      this.$refs.dialog.dialogVisible=true
    },
    editUserClick(row) {
      this.currentUserInfo = row
      this.$refs.dialog.dialogVisible = true
    },
    clearCurrentUserInfo() {
      this.currentUserInfo = {}
    },
    async deluser(row){
      const {id} = row
      const result = await this.$confirm(`即将删除用户 ${row.username} 此操作不可逆，是否确认`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => {})
      if(result !== "confirm") return
      const {meta} = await deluser(id)
      if(meta.status !== 200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      this.userParams.pagenum = 1
      this.getUser()
    },
    roleclick(row){
      this.roleInfo = row
      this.$refs.roledialog.dialogVisible=true
    },
    async getrole(){
      const {meta,data} = await getrolelist()
      if(meta.status !== 200) return
      this.rolesList = data
    },
    async changeUserStatus(row){
      const {mg_state:type,id:uid} = row
      const {meta} = await changeuserstatus(uid,type)
      if(meta.status !== 200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
    }
  }
}
</script>

<style lang="less" scoped>
.el-row{
  margin-bottom: 15px;
}
</style>