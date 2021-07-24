/*
  基于 axios 封装的请求模块
*/
import axios from 'axios'
import JSONbig from 'json-bigint'
// 因为不是在.vue组件中,所以需要单独引入 信息提示
import { Message } from 'element-ui'
// 引入路由
import router from '@/router'

// 创建一个 axios 实例，说白了就是复制一个 axios
// 我们通过这个实例去发送请求，把需要配置 配置给这个实例来处理
const request = axios.create({
  // 请求基础路径
  baseURL: 'http://api-toutiao-web.itheima.net',

  // 定义后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
  transformResponse: [
    function (data) {
      // 做任何你想转换数据的事情
      // 后端返回的数据可能不是JSON 格式字符串
      // 如果不是的话，那么 JSONbig.parse 调用会报错

      // 所以我们使用 try-catch 来捕获异常，处理异常的发生
      try {
        // 如果转换成功，则直接把结果返回
        return JSONbig.parse(data)
      } catch (err) {
        console.log('转换失败', err)
        // 如果转换失败了，则进入这里
        // 我们在这里把数据原封不动的直接返回给请求使用
        return data
      }
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  // 任何请求都会经过这里
  // config 是当前请求相关的配置信息对象
  // config 是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有登录用户信息，则统一设置 token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 然后我们就可以允许请求出去前定制统一业务功能处理
    // 例如：统一的设置 token

    // 当这里 return config 之后请求才会真正的发出去
    return config
  },
  // 请求失败，会经过这里
  function (error) {
    return Promise.reject(error)
  }
)
// 响应拦截器
request.interceptors.response.use(
  function (response) {
    // 所有响应码为 2xx 的响应都会进入这里

    // response 是响应处理
    // 注意：一定要把响应结果 return, 否则真正请求的位置拿不到响应结果的数据
    return response
  },
  function (error) {
    // 任何超出 2XX 的响应码都会进入这里
    if (status === 401) {
      // 跳转到登录页面
      // 清除本地存储缓存中的用户登录状态
      window.localStorage.removeItem('user')
      router.push('/login')
      Message.err('登录状态无效，请重新登录')
    } else if (status === 403) {
      // Token 未携带或已过期
      Message.warning('没有操作权限')
    } else if (status === 400) {
      // 客户端参数错误
      Message({
        type: 'error',
        message: '参数错误，请检查请求参数'
      })
    } else if (status >= 500) {
      Message.error('服务器内部异常，请稍后重试')
    }

    return Promise.reject(error)
  }
)

// 导出请求方法
export default request

// 谁要使用请求方法，谁就加载request模块
// import request from 'request.js'
// request.xxx
// request({
//   method: ,
//   url: ''
// })
