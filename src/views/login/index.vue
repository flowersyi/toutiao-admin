<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <el-form class="login-form" ref="login-form" :model="user" :rules="LoginRules">
        <el-form-item prop="mobile">
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="onLogin" :loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: false // 是否同意协议选中的状态

      },
      loginLoading: false, // 登录按钮loading状态
      LoginRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '验证码格式不正确', trigger: 'blur' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请同意用户协议'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    onLogin () {
      // 获取表单数据 (根据接口要求绑定数据)
      // const user = this.user

      // 表单验证
      // validate 方法是异步的
      this.$refs['login-form'].validate(valid => {
        if (!valid) {
          return
        }
        // 验证通过，提交登录
        this.login()
      })
    },
    login () {
      // 获取表单数据
      // const user = this.user
      // 开启登录中的 loading 状态
      this.loginLoading = true

      // 验证通过，提交表单
      login(this.user).then(res => {
        // 登录成功
        console.log(res)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 关闭 loading 状态
        this.loginLoading = false

        // 将接口返回的用户相关的数据放到本地储存，方便应用数据共享
        // 本地存储只能存储字符串
        // 如果需要存储对象、数组类型的数据，则把他们转为 JSON 格式字符串进行存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))

        // 跳转到首页
        // this.$router.push('/')
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('登录失败')
        // 关闭 loading 状态
        this.loginLoading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .login-form-wrap {
    padding: 20px 50px 25px;
    background: #fff;
    .login-head {
      min-width: 300px;
      display: flex;
      justify-content: center;
      .logo {
        width: 200px;
        height: 60px;
        background: url('./logo_index.png') no-repeat;
        background-size: contain;
      }
    }
  }
  .login-form {
    .login-btn {
      width: 100%;
    }
  }
}
</style>
