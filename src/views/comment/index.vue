<template>
  <div class="commentsIndex">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table
        :data="comments"
        border
        style="width: 100%"
        stripe
        empty-text="数据加载中"
        class="comment-table"
      >
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column label="评论状态">
          <template slot-scope="scope">
            <span>{{ scope.row.comment_status ? '正常' : '关闭' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="改变评论状态">
          <template slot-scope="scope">
            <el-switch
              :disabled="scope.row.disabled"
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total,sizes,prev, pager, next, jumper"
        :total="totalCount"
        :current-page.sync="page"
        :page-sizes="pageSizes"
        :page-size.sync="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
export default {
  name: 'CommentsIndex',
  components: {},
  props: {},
  data () {
    return {
      comments: [], // 评论列表数据
      totalCount: null,
      page: 1,
      pageSizes: [10, 20, 30, 50],
      pageSize: 10
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles(1)
  },
  mounted () { },
  methods: {
    loadArticles (page = 1) {
      getArticles({ response_type: 'comment', page, per_page: this.pageSize }).then(res => {
        const results = res.data.data.results
        results.forEach(article => {
          article.disabled = false
        })
        this.comments = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 开启禁用开关
      article.disabled = true
      console.log(article.comment_status)
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        // 关闭禁用开关
        article.disabled = false
        this.$message({
          message: `${article.comment_status ? '开启文章评论' : '关闭文章评论'}状态`,
          type: 'success'
        })
      })
    },
    handleSizeChange (pagesize) {
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      this.loadArticles(page)
    }
    // commentsManage () {
    //   this.$router.push('/comment/' + 141387)
    //   eventBus.$emit('comment-data', 10)
    // }
  }
}
</script>

<style scoped lang="less">
.comment-table {
  margin-bottom: 20px;
}
</style>
