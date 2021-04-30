<template>
<div class="addgoods">
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>{{fromedit ? '编辑商品' : '添加商品'}}</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card">
    <el-alert :title="fromedit ? '编辑商品信息' :'添加商品信息'" center type="info" :closable="false" show-icon></el-alert>
    <el-steps :active="active" finish-status="success" space="80%" align-center style=" margin:15px 0">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-form :model="addgoodmodel" :rules="addgoodrule" ref="addgood">
      <el-tabs tab-position="left" :before-leave="handleClick" value="first">
        <el-tab-pane label="基本信息" name="first">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addgoodmodel.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addgoodmodel.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addgoodmodel.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addgoodmodel.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
                :show-all-levels="true"
                v-model="addgoodmodel.goods_cat"
                :options="catList"
                :props="{expandTrigger: 'hover',value:'cat_id',label:'cat_name'}"
                @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="second">
          <el-row>
            <el-col v-for="item in manyParams" :key="item.cat_id">
              <el-row>
                <el-col>{{item.attr_name}}</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10" v-for="citem in item.attr_vals" :key="citem.id">
                  <el-checkbox v-model="citem.checked" :label="citem.name" border></el-checkbox>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="third">
          <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="fourth">
          <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="{'authorization':token}"
              :file-list="fileList"
              :on-success="upcoadafter"
              >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="fifth">
          <div id="edit">

          </div>
          <el-button size="small" type="primary" @click="addGoods" style="margin-top: 15px;">{{fromedit ? '修改商品' : '添加商品'}}</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</div>
</template>

<script>
import {getcatelist,getparams,addgoods,getgood,editgood} from "@/network/api";
import wangEditor from 'wangeditor'
export default {
  name: "Addgoods",
  data(){
    return {
      active:0,
      addgoodmodel:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        goods_cat:[],
      },
      addgoodrule:{
        goods_name:[{ required: true, message: '商品名称不可为空', trigger: 'blur' }],
        goods_price:[{ required: true, message: '商品价格不可为空', trigger: 'blur' }],
        goods_weight:[{ required: true, message: '商品重量不可为空', trigger: 'blur' }],
        goods_number:[{ required: true, message: '商品数量不可为空', trigger: 'blur' }],
        goods_cat:[{ required: true, message: '商品数量不可为空', trigger: 'blur' }]
      },
      catList:[],
      manyParams:[],
      onlyParams:[],
      fileList:[],
      token:'',
      pics:[{pic:''}],
      editorData:'',
    }
  },
  created() {
    this.getCateList()
    this.getGoodList()
    this.token = sessionStorage.getItem('token')
  },
  mounted() {
    const editor = new wangEditor(`#edit`)
    editor.config.onchange = (newHtml) => {
      this.editorData = newHtml
    }
    editor.create()
    this.editor = editor
  },
  methods:{
    async getGoodList(){
      if(!this.fromedit) return
      const {meta,data} = await getgood(this.$route.query.id)
      if(meta.status !== 200) return
      let {goods_name,goods_number,goods_price,goods_weight,goods_introduce,goods_cat} = data
      goods_cat = goods_cat.split(',')
      this.addgoodmodel = {goods_name,goods_number,goods_price,goods_weight,goods_cat}
      this.editorData = goods_introduce
    },
    async getCateList() {
      const {meta,data} = await getcatelist()
      if(meta.status !== 200) return
      this.catList = data
    },
    handleClick(activeName, oldActiveName){
      if(oldActiveName === 'first' && this.addgoodmodel.goods_cat.length<=0) {
        this.$message.error('请选择分类')
        return false
      }
      if(activeName==='first'){
        this.active=0
        return true
      }
      if(activeName==='second'){
        this.getManyParams()
        this.active=1
        return true
      }
      if(activeName === 'third'){
        this.getOnlyParams()
        this.active=2
        return true
      }
      if(activeName==='fourth'){
        this.active=3
        return true
      }
      if(activeName === 'fifth'){
        this.active=4
        return true
      }
    },
    handleChange(){

    },
    async getManyParams() {
      const {meta,data} = await getparams(this.addgoodmodel.goods_cat[this.addgoodmodel.goods_cat.length-1],'many')
      if(meta.status !== 200) return
      data.forEach(item=>{
        let newattr = item.attr_vals.split(' ')
        let turattr = []
        newattr.forEach((citem,index)=>{
          let newobj={}
          newobj.id = index
          newobj.name=citem
          newobj.checked=true
          turattr.push(newobj)
        })
        item.attr_vals = turattr
      })
      this.manyParams = data
    },
    async getOnlyParams(){
      const {meta,data} = await getparams(this.addgoodmodel.goods_cat[this.addgoodmodel.goods_cat.length-1],'only')
      if(meta.status !== 200) return
      this.onlyParams = data
    },
    upcoadafter(response){
      const {meta,data} = response
      if(meta.status !== 200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      this.pics[0].pic=data.tmp_path
      console.log(response)
    },
    addGoods(){
      this.$refs.addgood.validate(async valid=>{
        if(!valid) return
        if(this.fromedit){
          let goods_cat = this.addgoodmodel.goods_cat.join(',')
          let {goods_name,goods_price,goods_number,goods_weight} = this.addgoodmodel
          let goods_introduce=this.editorData
          let attrs = this.manyParams.concat(this.onlyParams)
          let data ={goods_cat,goods_name,goods_price,goods_number,goods_weight,goods_introduce,attrs}
          const {meta} = await editgood(this.$route.query.id,data)
          if(meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        } else {
          let goods_cat = this.addgoodmodel.goods_cat.join(',')
          let {goods_name,goods_price,goods_number,goods_weight} = this.addgoodmodel
          let goods_introduce=this.editorData
          let attrs = this.manyParams.concat(this.onlyParams)
          let data ={goods_cat,goods_name,goods_price,goods_number,goods_weight,goods_introduce,attrs}
          const {meta} = await addgoods(data)
          if(meta.status !== 201) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        }
        this.$router.push('/goods')
      })
    },
  },
  computed:{
    fromedit(){
      return Boolean(this.$route.query.id)
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox{
  font-size: 14px;
}
</style>