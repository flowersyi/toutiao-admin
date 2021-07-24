/*
  评论相关接口
*/
import request from '@/utils/request'
// 获取每篇文章的具体评论内容
export const articleComments = (params, allowComment) => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/comments',
    params,
    body: {
      allow_comment: allowComment
    }
  })
}
