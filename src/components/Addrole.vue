<template>
<div class="addrole">
  <el-dialog
      :title="fromEdit ? '编辑用户' : '添加用户'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false">
    <el-form :model="roleForm" status-icon :rules="roleFormRule" ref="roleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName" >
        <el-input type="text" v-model="roleForm.roleName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input type="text" v-model="roleForm.roleDesc" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="submitrole">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import {addrole,editrole} from "@/network/api";

export default {
  name: "Addrole",
  props:["currentRoleInfo"],
  data(){
    return {
      dialogVisible:false,
      roleForm:{
        roleName:'',
        roleDesc:'',
      },
      roleFormRule:{
        roleName:[
          {required: true, message:'角色名不能为空', trigger: 'blur'},
        ],
        roleDesc:[
          {required: true, message:'角色描述不能为空', trigger: 'blur'},
        ]
      }
    }
  },
  methods:{
    handleClose(){
      this.$refs.roleForm.resetFields()
      this.$emit('clearCurrentRoleInfo')
      this.dialogVisible=false
    },
    submitrole(){
      this.$refs.roleForm.validate(async valid=>{
        if(!valid) return
        if(this.fromEdit){
          const {meta} = await editrole(this.currentRoleInfo.id,this.roleForm)
          if(meta.status!==200) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        } else {
          const {meta} = await addrole(this.roleForm)
          if(meta.status !== 201) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        }
        this.$parent.getRoleList()
        this.dialogVisible = false
      })
    }
  },
  computed:{
    fromEdit() {
      const { id, roleName } = this.currentRoleInfo
      return !!(id || roleName)
    }
  },
  watch:{
    currentRoleInfo(newValue){
        const {roleName,roleDesc} = newValue
        this.roleForm = {roleName,roleDesc}
    }
  }
}
</script>

<style scoped>

</style>