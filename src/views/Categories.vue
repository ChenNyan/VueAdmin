<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>

      <el-table :data="cateList" style="width: 100%" border row-key="cat_id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="email" label="是否有效">
          <template #default='{row}'>
            <i class="el-icon-success" style="color: greenyellow"></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template #default="{row}">
            <el-tag v-if="row.cat_level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="row.cat_level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template #default="{ row }">
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editCate(row)"
            >编辑</el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delCate(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          :page-sizes="[3, 5, 10, 15]"
          :page-size="cateParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="cateParams.pagenum">
      </el-pagination>
    </el-card>

    <addcate ref="addcate" :current_cate="current_cate" @clear_current_cate="clear_current_cate"></addcate>
  </div>
</template>

<script>
import {getcatelist,delCate} from "@/network/api";
import Addcate from "@/components/Addcate";

export default {
  name: 'Categories',
  components: {Addcate},
  data() {
    return {
      cateList:[],
      cateParams:{type:'', pagenum:1, pagesize:5},
      totalPage:0,
      current_cate:{}
    }
  },
  created() {
    this.getCateList()
  },
  methods:{
    async getCateList(){
      const {meta, data} = await getcatelist(this.cateParams)
      if(meta.status !== 200) return
      this.totalPage = data.total
      this.cateList=data.result
    },
    addCate(){
      this.$refs.addcate.dialogVisible = true
      this.$refs.addcate.getCateList()
    },
    editCate(row){
      this.current_cate=row
      this.$refs.addcate.dialogVisible=true
    },
    async delCate(row){
      const result = await this.$confirm(`即将删除分类 ${row.cat_name} 此操作不可逆，是否确认`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => {})
      if(result !== "confirm") return
      const {meta} = await delCate(row.cat_id)
      if(meta.status !== 200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      this.getCateList()
    },
    sizeChange(size){
      this.cateParams.pagesize = size
      this.getCateList()
    },
    currentChange(page){
      this.cateParams.pagenum = page
      this.getCateList()
    },
    clear_current_cate(){
      this.current_cate={}
    }
  },
 }
</script>

<style lang="less" scoped>
.el-row{
  margin-bottom: 15px;
}
</style>