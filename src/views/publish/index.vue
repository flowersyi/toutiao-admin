<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ this.$route.query.id? '修改文章' : '发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        ref="publish-form"
        :model="article"
        label-width="80px"
        :rules="rules"
        validate-on-rule-change
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap
            type="textarea"
            v-model="article.content"
            :extensions="extensions"
            lang="zh"
            height="350"
            placeholder="请输入文章内容"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="article.cover.type > 0">
            <el-row :gutter="20">
              <el-col :span="4" v-for="(image,index) in article.cover.type" :key="index">
                <!--
            我们需要把选择的封面图片的地址放到article.cover.images 数组中

            当你给事件处理函数传递了自定义参数以后，就无法得到原本的那个数据参数了。

            如果想要在事件处理函数自定义传参以后想要得到原来的那个事件本身的参数，则手动指定$event,它代表事件本身的参数

            在组件上使用v-model

            当你给子组件提供的数据既要使用还要修改，这个时候我们可以使用 v-model 简化数据绑定
            v-model="article.cover.images[index]"
            给子组件传递了一个名字叫value的数据
            :value="article.cover.images[index]"
            默认监听 input 事件，当事件发生，它会让 绑定数据 = 事件参数
            @input="article.cover.images[index] = 事件参数"
                -->
                <upload-image v-model="article.cover.images[index]"></upload-image>
              </el-col>
            </el-row>
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择活动区域">
            <el-option
              v-for="(channel, index) in channels"
              :label="channel.name"
              :value="channel.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getArticleChannels, addArticle, getArticle, editArticle } from '@/api/article'
import {
  // 需要的 extensions
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  CodeBlock,
  TextColor
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'
import UploadImage from './components/upload-image'
export default {
  name: 'publishIndex',
  components: { 'el-tiptap': ElementTiptap, UploadImage },
  props: {},
  data () {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        channel_id: null, // 文章频道
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 封面图片地址
        }
      },
      channels: [],
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            },
            trigger: 'blur'
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道', trigger: 'change' }
        ]
      },
      // 编译器的 extensions
      // 它们将会按照声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 气泡菜单中的“渲染”命令按钮。
        new Image({
          // 默认会把图片生成 base64 字符串和内容存储在一起，如果需要自定义图片上传

          uploadRequest (file) {
            // 如果接口要求 Content-Type 是 multipart/form-data, 则要求请求体必须使用 FormData
            const fd = new FormData()
            fd.append('image', file)
            // 第一个 return 是返回 Promise 对象
            // 为什么？因为 axios 本身就是返回 Promise 对象
            return uploadImage(fd).then(res => {
              // 这个 return 是返回最后的结果
              return res.data.data.url
            })
          } // 图片的上传方法，返回一个 Promise<url>
        }),
        // new Underline({ bubble: true, menubar: false }), // “渲染”命令按钮位于气泡菜单中，但不在菜单栏中。
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 华丽的分割线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock(),
        new TextColor()
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticleChannels()

    // 由于我们让发布和修改使用的同一个组件
    // 所以这里要判断
    // 如果路由路径参数中有 id, 则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () { },
  methods: {
    loadArticleChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    // 修改文章：加载文章内容
    loadArticle () {
      // 找到数据接口
      // 封装请求方法
      // 请求获取数据
      getArticle(this.$route.query.id).then(res => {
        // 模板绑定展示
        this.article = res.data.data
      })
    },
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(value => {
        // 验证失败，停止提交表单
        if (!value) {
          return
        }
        // 找到数据接口
        // 封装请求方法
        // 请求提交表单
        // 如果是修改文章，则执行修改操作，否则执行添加操作
        const targitId = this.$route.query.id
        if (targitId) {
          // 执行修改操作
          editArticle(targitId, this.article, draft).then(res => {
            this.$message({
              message: draft ? '存入草稿成功' : '修改文章成功',
              type: 'success'
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          })
        } else {
          addArticle(this.article, draft).then(res => {
            // 处理响应结果
            this.$message({
              message: draft ? '存入草稿成功' : '发布文章成功',
              type: 'success'
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
