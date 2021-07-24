import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Image from '@/views/image'
import Comment from '@/views/comment'
import Account from '@/views/account'
import Fans from '@/views/fans'
Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 命名路由 layout 有一个默认子路由，这个名字就没有意义，所以警告
    // 正确的做法是：如果有默认子路由，就不要给父路由取名字了
    // name: 'layout',
    component: Layout,
    children: [
      {
        // 我们通常把根路由 / 设置为网站的首页
        // 因为我们在手动输入网址访问网站的时候，可以省略 /
        // 如果你是别的名称，则必须加上
        path: '', // path 为空，会作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        nmae: 'comment',
        component: Comment
      },
      {
        path: '/account',
        name: 'account',
        component: Account
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫，说白了所有页面的导航会经过这里
// 守卫页面的导航的
// to: 当前导航要去的路由
// from: 当前导航正要离开的路由
// next: 放行方法
router.beforeEach((to, from, next) => {
  // 路由的全局前置守卫中，开启顶部导航进度特效
  NProgress.start()

  // 如果要访问的页面不是 /login, 校验登录的状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了，则允许通过
  // 允许通过 next()
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      // 已经登录，允许通过
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，允许通过
    next()
  }
  // 停止导航
  // 我们可以在一些特殊情况下，停留在当前页面，中断当前导航
  // next(false)
})

// 路由的全局后置守卫
router.afterEach((to, from) => {
  // 结束顶部的导航进度条

  NProgress.done()
})

export default router
