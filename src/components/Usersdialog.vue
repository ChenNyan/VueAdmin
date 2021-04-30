<template>
<div class="usersdivlog">
  <el-dialog
      :title="fromEdit ? '编辑用户' : '添加用户'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username" >
        <el-input type="text" v-model="ruleForm.username" autocomplete="off" :disabled="fromEdit"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!fromEdit">
        <el-input type="text" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="ruleForm.mobile" autocomplete="off"></el-input>
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
import {mobiletest} from "@/utils/rulefun";
import {adduser,edituser} from "@/network/api";

export default {
  props: ['currentUserInfo'],
  name: "Usersdialog",
  data() {
    return {
      dialogVisible: false,
      ruleForm:{
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      rules:{
        username:[
          {required: true, message:'用户名不能为空', trigger: 'blur'},
          {min:3, max:10, message:'用户名长度必须为3-10位', trigger: 'blur'}
        ],
        password:[
          {required: true, message:'密码不能为空', trigger: 'blur'},
          {min:6, max:15, message:'密码长度必须为6-15位', trigger: 'blur'}
        ],
        email:[
          {required: true, message:'邮箱不能为空', trigger: 'blur'},
          {type:'email', message:'邮箱格式不合法', trigger: 'blur'}
        ],
        mobile:[
          {required: true, message:'手机号码不能为空', trigger: 'blur'},
          {validator: mobiletest, trigger: 'blur'},
        ],
      }
    }
  },
  methods:{
    handleClose() {
      this.$refs.ruleForm.resetFields()
      this.$emit('clearCurrentUserInfo')
      this.dialogVisible = false
    },
    submituser(){
      this.$refs.ruleForm.validate(async (valid)=>{
        if(!valid) return
        const {id} = this.currentUserInfo
        const {email,mobile} = this.ruleForm
        if(this.fromEdit){
          const {meta} = await edituser(id,{email,mobile})
          if(meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        } else {
          const {meta} = await adduser(this.ruleForm)
          if(meta.status !== 201) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
        }
        this.$parent.getUser()
        this.dialogVisible = false
      })
    }
  },
  computed:{
    fromEdit() {
      const { id, username } = this.currentUserInfo
      return !!(id || username)
    },
  },
  watch:{
    currentUserInfo(newValue){
      const {username,email,mobile} = newValue
      this.ruleForm = {username,email,mobile}
    }
  }
}
</script>

<style scoped>

</style>