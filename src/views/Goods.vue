<template>
  <div class="goods">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
              placeholder="请输入内容"
              v-model="goodParams.query"
              class="input-with-select"
              clearable
              @clear="clearKey"
          >
            <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchClick"
                :disabled="goodParams.query.length <= 0"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsClick">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="750px"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）"> </el-table-column>
        <el-table-column prop="goods_weight" label="重量（kg）"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间"> </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editGoodsClick(row)"
            ></el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delGoods(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          :page-size="goodParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="goodParams.pagenum"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {getgoods,delgoods} from "@/network/api";

export default {
  name: 'Goods',
  data() { 
    return {
      goodParams:{query:'', pagenum: 1, pagesize: 5 },
      goodsList:[],
      totalPage:0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods:{
    async getGoodsList(){
      const {meta,data} = await getgoods(this.goodParams)
      if(meta.status !== 200) return
      this.totalPage = data.total
      this.goodsList = data.goods
    },
    sizeChange(size) {
      this.goodParams.pagesize = size
      this.getGoodsList()
    },
    currentChange(page){
      this.goodParams.pagenum = page
      this.getGoodsList()
    },
    clearKey(){
      this.goodParams.pagenum=1
      this.getGoodsList()
    },
    searchClick(){
      this.goodParams.pagenum = 1
      this.getGoodsList()
    },
    addGoodsClick(){
      this.$router.push('/addgoods')
    },
    editGoodsClick(row){
      this.$router.push({
        path:'/addgoods',
        query:{
          id:row.goods_id
        }
      })
    },
    async delGoods(row){
      const result = await this.$confirm(`即将删除商品 ${row.goods_name} 此操作不可逆，是否确认`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => {})
      if(result !== "confirm") return
      const {meta} = await delgoods(row.goods_id)
      if(meta.status!==200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      this.getGoodsList()
    }
  },
 }
</script>

<style lang="less" scoped>
.el-row{
  margin-bottom: 15px;
}
</style>