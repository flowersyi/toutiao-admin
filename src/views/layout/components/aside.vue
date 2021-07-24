<template>
  <el-menu
    :default-active="$route.path"
    router
    class="nav-menu"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse="isCollaspe"
  >
    <el-menu-item index="/">
      <i class="iconfont iconshouye"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="iconfont iconneirongguanli"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont icontupian"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont iconfabu"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="iconfont iconpinglun"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="iconfont iconfensi"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/account">
      <i class="iconfont iconshezhi"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AdminAside',
  components: {},
  props: {
    'is-collaspe': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {}
}
</script>

<style scoped lang="less">
.iconfont {
  margin-right: 10px;
}
</style>
