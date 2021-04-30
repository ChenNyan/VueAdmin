<template>
<div class="addcate">
  <el-dialog
      :title="fromEdit ? '编辑分类' : '添加分类'"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleClose">
    <el-form  :model="cateForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="cateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类" v-if="!fromEdit">
        <el-cascader
            :show-all-levels="true"
            v-model="value"
            :options="catList"
            :props="{checkStrictly: true,value:'cat_id',label:'cat_name'}"
            @change="handleChange">
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="submidCate">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import {getcatelist,addcate,editCate} from "@/network/api";

export default {
  props: ['current_cate'],
  name: "Addcate",
  data(){
    return {
      value:'',
      dialogVisible:false,
      catList:[],
      cateForm:{
        cat_name:'',
      },
      rules:{
        cat_name:[{ required: true, message: '分类名称不可为空', trigger: 'blur' },]
      }
    }
  },
  methods:{
    handleClose(){
      this.dialogVisible = false
      this.$refs.ruleForm.resetFields()
      this.$emit('clear_current_cate')
    },
    handleChange(value){
      console.log(value)
    },
    async getCateList() {
      const {meta,data} = await getcatelist()
      if(meta.status !== 200) return
      this.catList = data
    },
    submidCate(){
      this.$refs.ruleForm.validate(async valid=>{
        if(!valid) return
        if(this.fromEdit){
          const {meta} = await editCate(this.current_cate.cat_id,this.cateForm.cat_name)
          if(meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        } else {
          const {meta} = await addcate({cat_pid:this.value[this.value.length-1],cat_name:this.cateForm.cat_name,cat_level:this.value.length||0})
          if(meta.status !== 201) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        }
        this.dialogVisible=false
        this.$refs.ruleForm.resetFields()
        this.$parent.getCateList()
      })
    }
  },
  computed:{
    fromEdit(){
      const { cat_id, cat_name } = this.current_cate
      return !!(cat_id || cat_name)
    }
  },
  watch:{
    current_cate(newValue){
      const {cat_name} = newValue
      this.cateForm = {cat_name}
    }
  }
}
</script>

<style scoped>

</style>