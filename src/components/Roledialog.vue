<template>
<div class="roledialog">
  <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
    <el-row>
      <el-col>当前用户是：{{ roleInfo.username }}</el-col>
    </el-row>
    <el-row style="margin: 20px 0">
      <el-col>当前角色：{{ roleInfo.role_name }}</el-col>
    </el-row>

    <el-row>
      <el-col
      >分配角色
        <el-select v-model="roleId" placeholder="请选择">
          <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="btns">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitrole">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {changeuserrole} from "@/network/api";

export default {
  props:['roleInfo', 'rolesList'],
  name: "Roledialog",
  data(){
    return {
      dialogVisible:false,
      roleId: '',
    }
  },
  methods:{
    handleClose(){
      this.dialogVisible=false
    },
    async submitrole(){
      if (!this.roleId) return this.$message.error('请选择角色')
      const {meta} = await changeuserrole(this.roleInfo.id, this.roleId)
      if(meta.status!==200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      this.$parent.getUser()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.btns{
  text-align: right;
}
</style>