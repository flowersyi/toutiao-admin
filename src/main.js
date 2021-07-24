import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 加载 element 组件库
import ElementUI from 'element-ui'

// 加载 element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'

// 加载 nprogress 中指定的样式文件
// 注意：加载第三方包中的具体文件不需要写学具体路径，直接写包名
// 总结："包名/具体文件名"
import 'nprogress/nprogress.css'

// 加载全局样式文件
import './styles/index.less'

// 全局组成 element 组件库
Vue.use(ElementUI)

Vue.config.productionTip = false

// 创建 Vue 根实例
// 把 router 配置到根实例中
// 通过 render 方法把根组件 App 渲染到 #app 入口节点
new Vue({
  router,
  render: h => h(App)
  // el : '#app' // 等价于 $mount('#app')
}).$mount('#app')
