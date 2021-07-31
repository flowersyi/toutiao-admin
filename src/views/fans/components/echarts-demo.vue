<template>
  <div class="echart-container">
    <!-- 1为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div ref="echarts-main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
// 2.加载 echarts
import * as echarts from 'echarts'
import { getFollowersData } from '@/api/fans'

export default {
  name: 'EchartsIndex',
  components: {},
  props: {},
  data () {
    return {
      ageData: []
    }
  },
  computed: {},
  watch: {},
  created () {
    this.activeEchart()
  },
  // 注意：初始化操作 DOM 一定要写到 mounted 钩子函数中
  mounted () {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(
      this.$refs['echarts-main'],
      'light'
    )
    // 4.指定图表的配置项和数据
    // 5.使用刚指定的配置项和数据显示图表。
    myChart.setOption({
      title: {
        text: '粉丝图表'
      },
      legend: {
        padding: 5
      },
      tooltip: {},
      xAxis: {
        data: ['0-18', '19-23', '24-30', '31-40', '41-50', '50+']
      },
      yAxis: {
        name: '人数'
      },
      series: [{
        name: '年龄',
        type: 'bar',
        data: [1, 0, 0, 0, 0, 0]
      }]
    })
  },
  methods: {
    activeEchart () {
      getFollowersData().then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
