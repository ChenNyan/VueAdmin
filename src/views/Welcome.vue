<template>
  <div class="welcome">
    <h1>欢迎您！{{$store.state.userInfo.username}}</h1>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data() { 
    return {

    }
  },
  methods:{},
 }
</script>

<style lang="less" scoped>
h1{
  font-weight: bold;
  font-size: 30px;
}
</style>