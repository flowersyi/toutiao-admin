<template>
  <div class="fans-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="粉丝列表" name="first">
          <el-row :gutter="20">
            <el-col
              :xs="12"
              :sm="6"
              :md="6"
              :lg="4"
              class="fans-wrap"
              v-for="(fan, index) in fans"
              :key="index"
            >
              <div class="fans-item">
                <!--  style="width: 100px; height: 100px;" -->
                <el-avatar :size="80" :src="fan.photo" @error="errorHandler">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
                <p>{{fan.name}}</p>
                <el-button
                  type="primary"
                  :plain="noFollowBg"
                  @click="noFollowBg = !noFollowBg"
                >{{ noFollowBg ? '+关注' : '已关注'}}</el-button>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="粉丝图表" name="second" @click.native="activeEchart">
          <echarts-demo></echarts-demo>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <map-demo></map-demo>
    <bmap-demo></bmap-demo>
  </div>
</template>

<script>
import { getFans } from '@/api/article'
// 2. 加载 echarts
import EchartsDemo from './components/echarts-demo'
import MapDemo from './components/map-demo'
import BmapDemo from './components/bmap'
export default {
  name: 'FansIndex',
  components: {
    EchartsDemo, // echarts 图表
    MapDemo, // 结合百度地图的 echarts 图表
    BmapDemo // 纯百度地图
  },
  props: {},
  data () {
    return {
      activeName: 'first', // tabs 标签页
      noFollowBg: true,
      fans: [] // 粉丝列表
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadFans()
  },
  mounted () { },
  methods: {
    loadFans () {
      getFans().then(res => {
        this.fans = res.data.data.results
      })
    },
    handleClick () {
      console.log(this.activeName)
    },
    errorHandler () {
      return true
    }
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-bottom: 30px;
}
.fans-wrap {
  margin-bottom: 15px;
  .fans-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border: 1px solid #faebd7;
    padding: 15px 0;
  }
}
</style>
