<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select placeholder="请选择频道" v-model="channelId">
            <el-option label="全部" value="null"></el-option>
            <el-option
              v-for="(channel, index) in channels"
              :label="channel.name"
              :value="channel.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-DD"
            value-format="yyyy-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadArticles(1)" :disabled="loading">确定</el-button>
        </el-form-item>
      </el-form>
      <!-- /数据筛选表单 -->
    </el-card>
    <el-card class="box-card">
      <div slot="header">根据筛选条件查询到{{totalCount}}条结果</div>
      <!-- 数据列表 -->
      <!--
        Table 表格组件
        1、把需要展示的数组列表数据绑定给 table 组件的 data 属性
        注意：你不用去 v-for 遍历，它自己会遍历
        2、设计表格列 el-table-column
        width：可以设定表格列的宽度
        lable: 可以设定列的标题
        prop：用来设定要渲染的列表项数据字段，只能展示文本
        3、表格默认只能渲染普通文本，
        如果需要展示其他内容，例如放个按钮、图片之类，需要自定义表格列模板
        4、stripe属性可以创建带斑马纹的表格。
        它接受一个Boolean，默认为false，设置为true即为启用
      -->
      <el-table
        :data="articles"
        border
        style="width: 100%"
        size="mini"
        stripe
        v-loading="loading"
        class="article-table"
      >
        <el-table-column prop="cover" label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 150px;text-align: center;"
              :src="scope.row.cover.images[0]"
              fit="cover"
            >
              <div slot="placeholder" clas>
                <span>加载中...</span>
              </div>
              <div slot="error" class="image-slot">
                <img class="cover-img" src="./no-cover.gif" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag
              :type="articleStatus[scope.row.status].type"
            >{{articleStatus[scope.row.status].text}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="$router.push('/publish?id=' +scope.row.id)"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- /数据列表 -->
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        @current-change="onCurrentChange"
        :disabled="loading"
        :current-page.sync="page"
        :pager-count="9"
      ></el-pagination>
      <!-- /分页 -->
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' }, // 0
        { status: 1, text: '待审核', type: '' }, // 1
        { status: 2, text: '审核通过', type: 'success' }, // 2
        { status: 3, text: '审核失败', type: 'warning' }, // 3
        { status: 4, text: '已删除', type: 'danger' } // 4
      ],
      channels: [], // 文章频道
      articles: [], // 文章列表数据
      status: null, // 查询文章的状态，不传就是全部
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页显示条目个数
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      page: 1, // 当前页数
      loading: true // 表单数据加载状态 loading
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticleChannels()
    this.loadArticles(1)
  },
  mounted () { },
  methods: {
    loadArticles (page = 1) {
      // 开启加载状态
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 结束日期
      }).then(res => {
        // const { name } = user;  //定义变量name ,把user当做对象处理，并取其属性name ，赋值给变量name
        // 等价于 const name= user.name
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // 关闭加载中的 loading
        this.loading = false
      })
    },
    loadArticleChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      console.log(articleId)
      console.log(articleId.toString())
      deleteArticle(articleId.toString()).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.loadArticles(this.page)
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    }
  }
}
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}
.article-table {
  margin-bottom: 20px;
}
.cover-img {
  width: 150px;
  background-size: cover;
}
</style>
