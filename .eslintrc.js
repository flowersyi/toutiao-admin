/*
  ESlint 代码规范校验工具的配置文件
  修改好这个文件需要先删除缓存 node_modules文件夹下的 .cache 文件夹再重新启动项目，如 npm run serve
*/
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  // 自定义代码校验规范
  rules: {
    // process.env.NODE_ENV === 'production' 可以用来判定代码运行的环境
    // 我们开发的时候是这样的：npm run serve 启动开发模式
    // 将来代码开发好了要发布部署到线上：npm run build 构建生产环境（发布环境）运行的代码
    // production  生成环境
    // development 开发环境
    // no-console 是不允许代码 console.xxx 之类代码， 如 console.log 等
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'warn' : 'off'

    // 'no-unused-vars': 'off', // 表示关闭未使用的变量这个规则验证
  }
}
