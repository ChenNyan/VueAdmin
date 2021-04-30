<template>
<div class="login">
  <div class="loginbox">
    <div class="loginlogo">
      <img src="../assets/logo.png">
    </div>
    <el-form :model="loginform" status-icon :rules="loginrule" ref="ruleForm">
      <el-form-item prop="username">
        <el-input type="text" v-model="loginform.username" prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginform.password" prefix-icon="iconfont icon-3702mima"></el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="submitForm">登录</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import {login} from "@/network/api";
import {mapMutations} from 'vuex'
export default {
  name: "Login",
  data(){
    return {
      loginform:{
        username:'',
        password:''
      },
      loginrule:{
        username:[
          {required: true, message:'用户名不能为空', trigger: 'blur'},
          {min:3, max:10, message:'用户名长度必须为3-10位', trigger: 'blur'}
        ],
        password:[
          {required: true, message:'密码不能为空', trigger: 'blur'},
          {min:6, max:15, message:'密码长度必须为6-15位', trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    ...mapMutations(['changeUserinfo']),
    submitForm(){
      this.$refs.ruleForm.validate(async  valid=>{
        if(!valid) return
        const {meta,data} = await login(this.loginform)
        if(meta.status!==200) return this.$message.error(meta.msg)
        this.$message.success((meta.msg))
        sessionStorage.setItem('token',data.token)
        this.changeUserinfo(data)
        this.$router.replace('/home')
      })
    },
    resetForm(){
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login{
  height: 100%;
  background-color: #2b4b6b;
  .loginlogo{
    width: 130px;
    height: 130px;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .loginbox{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .el-form {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 20px;
    box-sizing: border-box;
    .btns {
      text-align: right;
    }
  }
}
</style>