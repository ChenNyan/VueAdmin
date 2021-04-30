<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限的名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template #default="{row}">
            <el-tag v-if="row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {getrights} from "@/network/api";

export default {
  name: 'Rights',
  data() { 
    return {
      rightsList:[]
    }
  },
  created() {
    this.getRightsList()
  },
  methods:{
    async getRightsList(){
      const {meta,data} = await getrights("list")
      if(meta.status!==200) return
      this.rightsList = data
    }
  },
 }
</script>

<style lang="less" scoped>

</style>