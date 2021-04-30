<template>
<div class="home">
  <el-container>
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png"/>
        <h1>电商后台管理系统</h1>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '63px' : '200px'">
        <div class="toggleCollapse" @click="isCollapse = !isCollapse">
          |||
        </div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#3d9eff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="citem.path" v-for="citem in item.children" :key="citem.id" @click="menuItemClick(citem.path)">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ citem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
import {getmenu} from "@/network/api";
import {mapMutations} from 'vuex'
import {resetRouter} from "@/router";

export default {
  name: "Home",
  data(){
    return {
      menuList:[],
      activePath:'',
      iconObj:{
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
    }
  },
  created() {
    this.activePath = sessionStorage.getItem('activePath')
    this.getMenuList()
  },
  methods:{
    ...mapMutations(['changeUserinfo']),
    async getMenuList(){
      const {meta,data} = await getmenu()
      if(meta.status!==200) return
      this.menuList = data
      sessionStorage.setItem('menus', JSON.stringify(data))
      resetRouter()
    },
    logout(){
      sessionStorage.clear()
      this.changeUserinfo({})
      this.$router.replace('/login')
    },
    menuItemClick(path){
      sessionStorage.setItem('activePath',path)
      this.activePath = path
    },
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      background-color: #373d41;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .logo {
        display: flex;
        align-items: center;
        img {
          height: 55px;
          width: 55px;
        }
        h1 {
          color: #fff;
          font-size: 20px;
          margin-left: 20px;
        }
      }
    }
    .el-aside {
      background-color: #333744;
      .el-menu{
        border-right: none;
      }
      .toggleCollapse {
        background-color: #4a5064;
        text-align: center;
        line-height: 25px;
        color: #fff;
        font-size: 10px;
        letter-spacing: 2px;
      }
      .iconfont {
        margin-right: 10px;
      }
    }
    .el-main {
      background-color: #eaedf1;
      height: calc(100vh - 60px);
      overflow-y: scroll;
    }
  }
}
</style>