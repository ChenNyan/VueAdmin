<template>
  <div class="reports">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="main" ref="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {getmath} from "@/network/api";

export default {
  name: 'Reports',
  data() { 
    return {

    }
  },
  methods:{},
  async mounted() {
    let myEcharts = echarts.init(document.querySelector('.main'))
    let options = {
      title: {
        text: '用户来源',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#E9EEF3',
          },
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          boundaryGap: false,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
    }

    const res = await getmath()
    options = Object.assign(options, res.data)
    myEcharts.setOption(options)
  },
 }
</script>

<style lang="less" scoped>
</style>