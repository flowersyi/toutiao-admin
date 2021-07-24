<template>
  <el-container class="layout-container">
    <el-aside width="auto" class="aside">
      <admin-aside class="nav-menu" :is-collaspe="isCollaspe" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <!--
              class 样式处理
              {
                css: 布尔值
              }
              true: 作为类名
              false: 不作为类名
          -->
          <i
            :class="{'el-icon-s-fold':!isCollaspe,'el-icon-s-unfold':isCollaspe}"
            @click="isCollaspe = !isCollaspe"
          ></i>头条后台管理平台
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img :src="user.photo" alt class="avatar" />
            <span v-cloak>{{user.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/account')">设置</el-dropdown-item>
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
            <!--
              组件默认不识别原生事件。
              注意：并不是所有的组件在注册事件的时候需要使用 .native 修饰符，
              例如 el-button 组件注册点击事件就不需要，这主要是因为该组件内部处理了。
              什么时候使用 .native？首先肯定是在组件上注册事件可能会用到，如果普通方式注册不上，这个时候加 .native 修饰符。
              例如你给一个组件注册一个 input 事件，如果直接 @input 注册无效，那就试一下 @input.native。
            -->
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!--
          设置 router-view 的 key 属性值为 $route.path
          从/page/1 => /page/2, 由于这两个路由的$route.path并不一样, 所以组件被强制不复用, 相关钩子加载顺序为:
          beforeRouteUpdate => created => mounted

          从/page?id=1 => /page?id=2, 由于这两个路由的$route.path一样, 所以和没设置 key 属性一样, 会复用组件, 相关钩子加载顺序为:
          beforeRouteUpdate
        -->
        <!--
          设置 router-view 的 key 属性值为 $route.fullPath
          从/page/1 => /page/2, 由于这两个路由的$route.fullPath并不一样, 所以组件被强制不复用, 相关钩子加载顺序为:
          beforeRouteUpdate => created => mounted

          从/page?id=1 => /page?id=2, 由于这两个路由的$route.fullPath并不一样, 所以组件被强制不复用, 相关钩子加载顺序为:
        beforeRouteUpdate => created => mounted-->
        <router-view :key="$route.fullPath" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AdminAside from './components/aside'
import { getUserProfile } from '@/api/user'
import eventBus from '@/utils/event-bus'
export default {
  name: 'LayoutIndex',
  components: {
    AdminAside
  },
  props: {},
  data () {
    return {
      user: {
        name: '',
        photo: ''
      }, // 当前登录用户的信息
      isCollaspe: false // 侧边状态栏的展示状态
    }
  },
  computed: {},
  watch: {},
  created () {
    // 组件初始化好，获取用户的资料
    this.loadUserProfile()
    eventBus.$on('update-user', (data) => {
      // data 是对象，对象赋值，地址引用同一个对象，会相互影响,所以不要赋值整个data对象
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  mounted () { },
  methods: {
    // 除了登录接口，其他接口都需要提供你的身份令牌（token）才能获取数据
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确认退出系统吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户登录状态清除
        window.localStorage.removeItem('user')

        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .aside {
    background-color: #d3dce6;
    .nav-menu {
      height: 100%;
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .avatar-wrap {
      display: flex;
      align-items: center;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .main {
    background: #e9eef3;
  }
}
</style>
