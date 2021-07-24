<template>
   <div class="echart-container">
    <!-- 1为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div ref="echarts-main" style="width: 600px;height:400px;"></div>
   </div>
</template>

<script>
// 2.加载 echarts
import * as echarts from 'echarts'

export default {
  name: 'EchartsIndex',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  // 注意：初始化操作 DOM 一定要写到 mounted 钩子函数中
  mounted () {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(
      this.$refs['echarts-main']
    )
    // 4.指定图表的配置项和数据
    // 5.使用刚指定的配置项和数据显示图表。
    myChart.setOption({
      title: {
        text: '粉丝图表'
      },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    })
  },
  methods: {}
}
</script>

<style scoped lang="less">
</style>
