<template>
<div class="roleassignation">
  <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleClose">
    <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
        ref="tree"
        :props="defaultProps">
    </el-tree>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="changeRights">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import {getrights,changerights} from "@/network/api";

export default {
  name: "Roleassignation",
  props:["currentRoleInfo"],
  data(){
    return {
      dialogVisible:false,
      rightsList:[],
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      defaultKeys:[]
    }
  },
  methods:{
    handleClose(){
      this.defaultKeys = []
      this.dialogVisible=false
    },
    async getRightsTree() {
      const {meta,data} = await getrights('tree')
      if(meta.status !== 200) return
      this.rightsList = data
    },
    async changeRights(){
      const {id:roleId} = this.currentRoleInfo
      console.log(this.currentRoleInfo)
      const {getCheckedKeys,getHalfCheckedKeys} = this.$refs.tree
      const rids = [...getCheckedKeys(),...getHalfCheckedKeys()].join(",")
      const {meta} = await changerights(roleId,rids)
      if(meta.status !== 200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      this.$parent.getRoleList()
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>