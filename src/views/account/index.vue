<template>
  <div class="account-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form
            ref="user-form"
            :model="user"
            label-width="80px"
            class="account-form"
            :rules="userRules"
          >
            <el-form-item label="编号">{{user.id}}</el-form-item>
            <el-form-item label="手机号">{{user.mobile}}</el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onUpdateUser">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- offset 栅格左侧的间隔格数 偏移  span 栅格占据的列数-->
        <el-col :offset="2" :span="6">
          <label for="file">
            <el-avatar
              shape="square"
              :size="150"
              fit="cover"
              :src="user.photo"
              style="cursor:pointer"
            ></el-avatar>
          </label>
          <!-- $refs.file.click() 触发 ref="file" 元素的点击事件 -->
          <p style="cursor: pointer" @click="$refs.file.click()">点击修改头像</p>
          <!-- @change="onFileChange" 选中图片触发 change 事件，来判断用户有没有修改头像-->
          <input type="file" hidden ref="file" id="file" @change="onFileChange" />
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <!-- 图片裁切插件 要求 用块元素（容器）包装图像或画布元素 -->
      <div class="preview-image-wrap">
        <img :src="previewImage" alt class="preview-image" ref="preview-image" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdatePhoto">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import eventBus from '@/utils/event-bus'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'AccountIndex',
  components: {},
  props: {},
  data () {
    return {
      userRules: {
        name: [
          { required: true, message: '请输入媒体名字', trigger: 'blur' },
          { min: 1, max: 7, message: '名字长度为 1 到 7 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      user: {
        id: null,
        email: '',
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false, // 控制上传图片裁切预览的显示状态(弹出层是否显示)
      previewImage: '', // 预览图片
      cropper: null // 裁切器实例
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () { },
  methods: {
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onSubmit () {
      console.log('11')
    },
    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file

      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      // 展示弹出层，预览用户选择的图片
      this.dialogVisible = true

      // 解决选择相同文件不触发 change 事件问题
      this.$refs.file.value = ''
    },
    onDialogOpened () {
      // 图片裁切器必须基于 img 进行初始化
      // 注意：img 必须是可见状态才能正常完成初始化
      // 因为我们这里要在对话框里面初始化裁切器
      // 所以务必在对话框完全打开的状态去进行初始化
      // 获取图片 DOM 节点
      const image = this.$refs['preview-image']

      // 第一次初始化好以后，如果预览裁切的图片（系统上传的图片文件发生变化）发生了变化，裁切器默认不会更新
      // 如果需要预览图片发生变化 更新裁切器
      //    方式一：裁切器.replace 方法
      //    方式二：销毁裁切器，重新初始化
      // 初始化裁切器
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }

      this.cropper = new Cropper(image, {
        viewMode: 1, // 裁切器不超出画布
        dragMode: 'none', // 定义裁切器的移动模式 none 啥也不做 ,不会创建新的裁切框（器），画布不会被拖动
        aspectRatio: 1, // 裁切框的比例
        cropBoxResizable: false, // 紧张通过拖动调整裁剪框的大小。
        background: false // 透明背景小格子
        // 滚轮缩放图片大小

        // 当你移动裁切器的时候会触发调用 crop 方法
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    onDialogClosed () {
      // 对话框关闭，销毁裁切器
      // this.cropper.destroy()
    },
    onUpdatePhoto () {
      // 获取裁切的图片对象（裁切的结果）
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        //  // 请求更新用户头像 请求提交 fd
        updateUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false

          // 更新视图展示
          // 把服务器端返回的图片进行加载有点慢
          // this.user.photo = res.data.data.photo

          // 直接把裁切结果的文件对象转给blob
          this.user.photo = window.URL.createObjectURL(file)
          eventBus.$emit('update-user', this.user)
          this.$message({
            message: '更新头像成功',
            type: 'success'
          })
        })
      })
    },
    onUpdateUser () {
      this.$refs['user-form'].validate((valid) => {
        if (!valid) {
          return false
        }
        const { name, intro, email } = this.user
        updateUserProfile({
          name, intro, email
        }).then(res => {
          eventBus.$emit('update-user', this.user)
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
