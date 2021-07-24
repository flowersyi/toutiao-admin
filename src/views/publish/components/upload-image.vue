<template>
  <div class="upload-cover" @click="onUploadShow">
    <div class="cover-wrap">
      <img class="cover-img" :src="value" />
    </div>
    <el-dialog title="选择封面" :visible.sync="dialogVisible" width="50%" center append-to-body>
      <!-- 标签导航 -->
      <!--
        el-tabs 组件
          v-model 双向绑定
            数据驱动视图：当绑定数据发生改变，激活的标签页受影响
            视图影响数据：当标签改变的时候，标签的 name 会同步到数据中
          label 标签的标题
          name 相当于标签的 id
      -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <!-- 标签内容写到里面来 -->
          <!--
            radio 有个 change 事件
            当选择的 radio 改变的时候会触发
          -->
          <image-list
            :is-show-upload="false"
            :is-show-operaction="false"
            :is-show-selected="true"
            ref="image-list"
          />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input type="file" @change="onFileChange" ref="file" />
          <img src alt width="120" ref="preview-img" style="background-size:cover" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
import ImageList from '@/views/image/components/image_list'

export default {
  name: 'uploadImage',
  components: { ImageList },
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'second' // 激活的标签页
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () { },
  methods: {
    onUploadShow () {
      this.dialogVisible = true // 显示弹窗
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]

      // 图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-img'].src = blob
      // 防止用户选择同一文件不触发change事件
      // this.$refs.file.files[0] = ''
    },
    // 点击确定按钮的时候
    onCoverConfirm () {
      // 如果tab是上传图片，并且input-file
      // 有选择的文件，才执行上传图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          // 关闭弹出层
          this.dialogVisible = false
          // 展示上传的图片
          // this.$refs['cover-image'].src = res.data.data.url

          // 将图片地址发送给父组件
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 还有一种组件通信方式：父组件可以直接访问子组件中的数据
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected === null) {
          this.$message('请选择封面图片')
          return
        }
        // 关闭对话框
        this.dialogVisible = false
        // 修改父组件绑定的数据
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}
</script>

<style scoped lang="less">
.upload-cover {
  cursor: pointer;
  position: relative;
}
.cover-wrap {
  border: 1px solid #000;
  border-radius: 6px;
  min-width: 150px;
  height: 120px;
  overflow: hidden !important;
  .cover-img {
    height: 120px;
    min-width: 100%;
    background-size: cover;
  }
}
</style>
