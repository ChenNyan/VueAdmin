<template>
  <div class="params">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          :closable="false"
          type="warning"
          show-icon>
      </el-alert>

      <el-form style="margin-top: 15px;">
        <el-form-item label="选择商品分类">
          <el-cascader
              :show-all-levels="true"
              v-model="value"
              :options="catList"
              :props="{expandTrigger: 'hover',value:'cat_id',label:'cat_name'}"
              @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button type="primary" @click="addManyParams">添加参数</el-button>
            </el-col>
          </el-row>

          <el-table :data="manyParams" style="width: 100%" border row-key="attr_id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column type="expand">
              <template #default="{row}">
                <el-tag style="margin-left: 15px;" @close="delManyVal(row,item)" closable v-for="item in row.attr_vals">{{item}}</el-tag>
                <el-button size="mini" style="margin-left: 15px;" @click="addManyVal(row.attr_id)">+添加标签</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="180px">
              <template #default="{ row }">
                <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="editManyParams(row)"
                >编辑</el-button>
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="delManyParams(row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button type="primary" @click="addOnlyParams">添加属性</el-button>
            </el-col>
          </el-row>

          <el-table :data="onlyParams" style="width: 100%" border row-key="attr_id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column type="expand">
              <template #default="{row}">
                <el-tag style="margin-left: 15px;" @close="delOnlyVal(row,item)" closable v-for="item in row.attr_vals">{{item}}</el-tag>
                <el-button size="mini" style="margin-left: 15px;" @click="addOnlyVal(row.attr_id)">+添加标签</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作" width="180px">
              <template #default="{ row }">
                <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="editOnlyParams(row)"
                >编辑</el-button>
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="delOnlyParams(row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
        title="添加新标签"
        :visible.sync="manyDialogVisible"
        width="30%"
        @close="manyHandleClose">
      <el-input v-model="newManyVal" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="manyHandleClose">取 消</el-button>
    <el-button type="primary" @click="submitManyVal">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
        title="添加新标签"
        :visible.sync="onlyDialogVisible"
        width="30%"
        @close="onlyHandleClose">
      <el-input v-model="newOnlyVal" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="onlyHandleClose">取 消</el-button>
    <el-button type="primary" @click="submitOnlyVal">确 定</el-button>
  </span>
    </el-dialog>
    <manyparams ref="manyparams" :currentManyParams="currentManyParams" @clearManyParams="clearManyParams"></manyparams>
    <onlyparams ref="onlyparams" :currentOnlyParams="currentOnlyParams" @clearOnlyParams="clearOnlyParams"></onlyparams>
  </div>
</template>

<script>
import {getcatelist,getparams,editParamsVal,delParams} from "@/network/api";
import Manyparams from "@/components/Manyparams";
import Onlyparams from "@/components/Onlyparams";

export default {
  name: 'Params',
  components: {Onlyparams, Manyparams},
  data() {
    return {
      activeName: 'first',
      value:'',
      catList:[],
      onlyParams:[],
      manyParams:[],
      manyDialogVisible:false,
      onlyDialogVisible:false,
      newOnlyVal:'',
      newManyVal:'',
      current_id:'',
      currentManyParams:{},
      currentOnlyParams:{}
    }
  },
  created() {
    this.getCateList()
  },
  methods:{
    async getCateList() {
      const {meta,data} = await getcatelist()
      if(meta.status !== 200) return
      this.catList = data
    },
    handleChange(value){
      this.getManyParams()
    },
    handleClick(value){
      if(value.name === 'second'){
        this.getOnlyParams()
      }
    },
    async getManyParams(){
      const {meta,data} = await getparams(this.value[this.value.length-1],'many')
      if(meta.status !== 200) return
      data.forEach(item=>{
        item.attr_vals = item.attr_vals.split(' ')
      })
      this.manyParams = data
    },
    async getOnlyParams(){
      const {meta,data} = await getparams(this.value[this.value.length-1],'only')
      if(meta.status !== 200) return
      data.forEach(item=>{
        item.attr_vals = item.attr_vals.split(' ')
      })
      this.onlyParams = data
    },
    addManyParams(){
      this.$refs.manyparams.dialogVisible=true
    },
    editManyParams(row){
      this.$refs.manyparams.dialogVisible=true
      this.currentManyParams=row
    },
    async delManyParams(row){
      const {attr_id} = row
      const result = await this.$confirm(`即将删除参数 ${row.attr_name} 此操作不可逆，是否确认`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => {})
      if(result !== "confirm") return
      const {meta} = await delParams(this.value[this.value.length-1],attr_id)
      if(meta.status !== 200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      this.getManyParams()
    },
    addOnlyParams(){
      this.$refs.onlyparams.dialogVisible=true
    },
    editOnlyParams(row){
      this.$refs.onlyparams.dialogVisible=true
      this.currentOnlyParams=row
    },
    async delOnlyParams(row){
      const {attr_id} = row
      const result = await this.$confirm(`即将删除参数 ${row.attr_name} 此操作不可逆，是否确认`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => {})
      if(result !== "confirm") return
      const {meta} = await delParams(this.value[this.value.length-1],attr_id)
      if(meta.status !== 200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      this.getOnlyParams()
    },
    async delManyVal(row,itemval){
      this.manyParams.forEach(item=>{
        item.attr_vals = item.attr_vals.filter(citem=>{
          return citem!==itemval
        })
      })
      let attr_vals = row.attr_vals.join(',')
      let data={attr_name:row.attr_name,attr_sel:'many',attr_vals}
      const {meta} = await editParamsVal(this.value[this.value.length-1],row.attr_id,data)
      if(meta.status !== 200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
    },
    addManyVal(id){
      this.current_id=id
      this.manyDialogVisible=true
    },
    manyHandleClose(){
      this.newManyVal=''
      this.manyDialogVisible=false
    },
    submitManyVal(){
      this.manyParams.forEach(async item=>{
        if(item.attr_id===this.current_id){
          item.attr_vals.push(this.newManyVal)
          let attr_vals = item.attr_vals.join(' ')
          let data={attr_name:item.attr_name,attr_sel:'many',attr_vals}
          const {meta} = await editParamsVal(this.value[this.value.length-1],item.attr_id,data)
          if(meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        }
      })
      this.newManyVal=''
      this.manyDialogVisible=false
    },
    onlyHandleClose(){
      this.onlyManyVal=''
      this.onlyDialogVisible=false
    },
    async delOnlyVal(row,itemval){
      this.onlyParams.forEach(item=>{
        item.attr_vals = item.attr_vals.filter(citem=>{
          return citem!==itemval
        })
      })
      let attr_vals = row.attr_vals.join(',')
      let data={attr_name:row.attr_name,attr_sel:'only',attr_vals}
      const {meta} = await editParamsVal(this.value[this.value.length-1],row.attr_id,data)
      if(meta.status !== 200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
    },
    addOnlyVal(id){
      this.current_id=id
      this.onlyDialogVisible=true
    },
    submitOnlyVal(){
      this.onlyParams.forEach(async item=>{
        if(item.attr_id===this.current_id){
          item.attr_vals.push(this.newOnlyVal)
          let attr_vals = item.attr_vals.join(' ')
          let data={attr_name:item.attr_name,attr_sel:'only',attr_vals}
          const {meta} = await editParamsVal(this.value[this.value.length-1],item.attr_id,data)
          if(meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        }
      })
      this.newOnlyVal=''
      this.onlyDialogVisible=false
    },
    clearManyParams(){
      this.currentManyParams={}
    },
    clearOnlyParams(){
      this.currentOnlyParams={}
    }
  },
 }
</script>

<style lang="less" scoped>
.el-row{
  margin-bottom: 15px;
}
</style>