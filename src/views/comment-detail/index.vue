<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>评论详情列表</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>

      <el-table :data="comments" style="width: 100%">
        <el-table-column label="头像" width="180">
          <template slot-scope="scope">
            <img width="50" :src="scope.row.aut_photo" />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评论内容" width="180"></el-table-column>
        <el-table-column prop="name" label="点赞" width="180">
          <template slot-scope="scope">{{ scope.row.is_liking === 1 ? '已赞' : '没有赞' }}</template>
        </el-table-column>
        <el-table-column prop="like_count" label="点赞数量" width="180"></el-table-column>
        <el-table-column prop="pubdate" label="评论日期" width="180">
          <template slot-scope="scope">
            <!--
              不传参：{{ scope.row.pubdate | dateFormat }}
              传参：{{ scope.row.pubdate | dateFormat(参数) }}
            -->
            {{ scope.row.pubdate | dateFormat('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column label="是否推荐" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_top"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onTop(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="reply_count" label="回复数量" width="180"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import eventBus from '@/utils/event-bus'
import { articleComments } from '@/api/comment'
export default {
  name: 'ComentDetail',
  components: {},
  props: {},
  data () {
    return {
      allowComment: true, // 接口所需参数，是否允许评论
      id: null, // 文章id
      comments: [] // 评论列表数据
    }
  },
  computed: {},
  watch: {},
  created () {
    eventBus.$on('comment-data', (arg) => {
      this.id = arg
    })
    console.log(this.id)
    this.loadArticleComments()
  },
  mounted () { },
  destroyed () {
    eventBus.$off('comment-data')
  },
  methods: {
    loadArticleComments () {
      console.log(this.id)
      articleComments({ type: 'c', source: this.id }, this.allowComment).then(res => {
        console.log(res)
        this.comments = res.data.data.results
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
