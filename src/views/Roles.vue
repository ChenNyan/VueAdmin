<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addRoleClick">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" style="width: 100%" border>
        <el-table-column type="expand">
          <template #default="{row}">
            <el-row v-for="(item, index) in row.children" :key="item.id" class="b_border" :class="{ t_border: index === 0 }">
              <el-col :span="5">
                <el-tag closable @close="delRoleRights(row, item.id)">{{item.authName}}{{item.id}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(citem, cindex) in item.children" :key="citem.id" :class="{ t_border: cindex !== 0 }">
                  <el-col :span="5">
                    <el-tag type="success" closable @close="delRoleRights(row, citem.id)">{{ citem.authName }}{{citem.id}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag @close="delRoleRights(row, ccitem.id)" type="warning" closable v-for="ccitem in citem.children" :key="ccitem.id">{{ ccitem.authName }}{{ccitem.id}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作" width="300px">
          <template #default="{row}">
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editRole(row)"
            >编辑</el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delRole(row)"
            >删除</el-button>
            <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="changeRoleClick(row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <addrole :currentRoleInfo="currentRoleInfo" @clearCurrentRoleInfo="clearCurrentRoleInfo" ref="addrole"></addrole>
    <roleassignation ref="roleassignation" :currentRoleInfo="currentRoleInfo"></roleassignation>
  </div>
</template>

<script>
import {getrolelist,delrole,deluserrights} from "@/network/api";
import Addrole from "@/components/Addrole";
import Roleassignation from "@/components/Roleassignation";

export default {
  name: 'Roles',
  components: {Roleassignation, Addrole},
  data() {
    return {
      roleList:[],
      currentRoleInfo:{},
    }
  },
  created() {
    this.getRoleList()
  },
  methods:{
    async getRoleList(){
      const {meta,data} = await getrolelist()
      if(meta.status!==200) return
      this.roleList=data
    },
    addRoleClick(){
      this.currentUserInfo = {}
      this.$refs.addrole.dialogVisible=true
    },
    editRole(row){
      this.currentRoleInfo = row
      this.$refs.addrole.dialogVisible=true
    },
    async delRole(row){
      const result = await this.$confirm(`即将删除角色 ${row.roleName} 此操作不可逆，是否确认`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => {})
      if(result !== "confirm") return
      const {meta} = await delrole(row.id)
      if(meta.status !==200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      this.getRoleList()
    },
    changeRoleClick(row){
      this.currentRoleInfo = row
      let { roleassignation } = this.$refs
      this.getDefaultKeys(row,roleassignation.defaultKeys)
      roleassignation.dialogVisible = true
      roleassignation.getRightsTree()
    },
    getDefaultKeys(data,arr){
      if(!data.children) return arr.push(data.id)
      data.children.forEach(item => {
        this.getDefaultKeys(item,arr)
      })
    },
    clearCurrentRoleInfo(){
      this.currentRoleInfo={}
    },
    async delRoleRights(row,rightId){
      const result = await this.$confirm(
          `你即将取消 ${row.roleName} 的某一些权限，此操作不可逆，是否确认`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).catch((err) => {})
      if (result !== 'confirm') return
      const {id:roleId} = row
      const {meta,data} = await deluserrights(roleId,rightId)
      if(meta.status !==200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      row.children=data
    }
  },
 }
</script>

<style lang="less" scoped>
.el-row{
  margin-bottom: 15px;
}
.b_border{
  border-bottom: 1px solid #ddd;
}
.t_border{
  border-top: 1px solid #ddd;
}
.el-tag{
  margin: 10px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>