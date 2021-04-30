<template>
<div class="manyparams">
  <el-dialog
      :title="fromEdit ? '编辑动态参数' : '添加动态参数'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="动态参数" prop="attr_name" >
        <el-input type="text" v-model="ruleForm.attr_name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="submituser">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import {addParams, editParams} from "@/network/api";

export default {
  props: ['currentManyParams'],
  name: "Manyparams",
  data(){
    return {
      dialogVisible:false,
      ruleForm:{
        attr_name:'',
      },
      rules:{
        attr_name:[{required: true, message:'参数名不可为空', trigger: 'blur'},]
      }
    }
  },
  methods:{
    handleClose(){
      this.$refs.ruleForm.resetFields()
      this.$emit('clearManyParams')
      this.dialogVisible=false
    },
    submituser(){
      this.$refs.ruleForm.validate(async valid=>{
        if(!valid) return
        const id = this.$parent.value[this.$parent.value.length-1]
        const {attr_name} = this.ruleForm
        if(this.fromEdit){
          const {attr_id} = this.currentManyParams
          const {meta} = await editParams(id,attr_id,{attr_name, attr_sel:'many'})
          if(meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        } else {
          const {meta} = await addParams(id,{attr_name, attr_sel:'many'})
          if(meta.status !== 201) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        }
        this.dialogVisible=false
        this.$refs.ruleForm.resetFields()
        this.$parent.getManyParams()
      })

    }
  },
  computed:{
    fromEdit(){
      const { attr_id, attr_name } = this.currentManyParams
      return !!(attr_id || attr_name)
    }
  },
  watch:{
    currentManyParams(newValue){
      const {attr_name} = newValue
      this.ruleForm = {attr_name}
    }
  }
}
</script>

<style scoped>

</style>