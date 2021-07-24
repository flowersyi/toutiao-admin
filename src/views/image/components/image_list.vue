<template>
  <div class="image-list">
    <div class="action-head">
      <el-radio-group v-model="collect" size="small" @change="loadImages(1)">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button type="success" @click="dialogVisible = true" size="mini" v-if="isShowUpload">上传素材</el-button>
    </div>
    <el-dialog title="上传图片" :visible.sync="dialogVisible" width="60%" :append-to-body="true">
      <el-upload
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        multiple
        @on-success="onUploadSuccess"
        :headers="uploadHeaders"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
    <el-row :gutter="20" class="image-row">
      <el-col
        :xs="12"
        :sm="6"
        :md="6"
        :lg="6"
        :xl="4"
        v-for="(image,index) in images"
        :key="index"
        class="image-item"
        @click.native="selected=index"
      >
        <el-image style="height: 150px;" :src="image.url" fit="cover">
          <div slot="error" class="image-slot image-no" style="height: 150px;line-height:150px;">
            <i class="el-icon-picture-outline">加载失败</i>
          </div>
        </el-image>
        <div class="operation-btn" v-if="isShowOperaction">
          <el-button
            type="warning"
            :icon="image.is_collected ? 'el-icon-star-on':'el-icon-star-off'"
            circle
            size="mini"
            :loading="image.loading"
            @click="onCollect(image)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            :loading="image.loading"
            @click="onDelete(image)"
          ></el-button>
        </div>
        <div class="selected-img" v-if="isShowSelected && selected === index"></div>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="imageTotal"
      :pager-count="9"
      :current-page="page"
      :page-size="pageSize"
      @current-change="onCurrentCahnge"
    ></el-pagination>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageIndex',
  components: {},
  props: {
    isShowUpload: {
      type: Boolean,
      default: true
    },
    isShowOperaction: {
      type: Boolean,
      default: true
    },
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: 'false', // 筛选图片，默认展示全部
      dialogVisible: false, // 上传对话框是否可见
      images: [], // 图片素材列表
      uploadHeaders: {
        Authorization: `token ${user.token}`
      },
      imageTotal: null, // 图片素材总数
      pageSize: 16, // 每页数据项数
      page: 1, // 当前页数
      selected: null // 选择图片，发布文章里
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages(1)
  },
  mounted () { },
  methods: {
    loadImages (page = 1) {
      // 重置高亮页码，防止数据与页码不对应
      this.page = page
      getImages({ collect: this.collect, page, per_page: this.pageSize }).then(res => {
        const results = res.data.data.results
        results.forEach(image => {
          // image 对象本来没有 loading 对象
          // 我们这里收到的往里面添加该数据来控制每个收藏按钮的loading状态
          image.loading = false
        })
        this.images = results
        this.imageTotal = res.data.data.total_count
      })
    },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogVisible = false
      // 刷新当前素材列表
      this.onCollectChange(false)
    },
    onCurrentCahnge (page) {
      this.loadImages(page)
    },
    onCollect (image) {
      // 开启 loading 状态
      image.loading = true
      collectImage(!image.is_collected, image.id).then(res => {
        this.$message({
          message: !image.is_collected ? '收藏成功' : '取消收藏成功',
          type: 'success'
        })
        image.is_collected = !image.is_collected
        if (this.collect && !image.is_collected) {
          this.loadImages(this.page)
        }
        // 关闭 Loading 状态
        image.loading = false
      })
    },
    onDelete (image) {
      image.loading = true
      deleteImage(image.id).then(res => {
        this.$message.error('删除成功')
        this.loadImages(this.page)
        image.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.action-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
}
.image-row {
  .el-col {
    margin-bottom: 10px;
    position: relative;
  }
  .image-item {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: #c1cdcd;
    .operation-btn {
      font-size: #fff;
      height: 35px;
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      left: 9px;
      right: 10px;
      bottom: 0px;
      text-align: center;
      justify-content: space-around;
      display: flex;
      align-items: center;
    }
    .image-no {
      display: block !important;
    }
  }
}

//选中图片
.selected-img {
  background: url(./selected.png) no-repeat 50% 50%;
  height: 100%;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
