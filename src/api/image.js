/*
  素材请求模块
*/
import request from '@/utils/request'

// 上传图片
export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    data
    // 一般上传文件的接口都要求把请求头中的 content-type 设置为 multipart/form-data,
    // 但是我们使用 axios 上传文件的话不需要手动设置，你只要给 data 一个 FormData 对象即可。
    // new FormData 对象即可
  })
}

// 获取图片素材列表
export const getImages = params => {
  return request({
    method: 'get',
    url: '/mp/v1_0/user/images',
    params
  })
}

// 收藏图片或取消收藏
export const collectImage = (collect, targetId) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${targetId}`,
    data: {
      collect
    }
  })
}

// 删除图片
export const deleteImage = targetId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${targetId}`
  })
}
