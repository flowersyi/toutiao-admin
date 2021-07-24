/*
文章相关请求模块
*/
import request from '@/utils/request'
// 获取文章
export const getArticles = params => {
  return request({
    method: 'get',
    url: '/mp/v1_0/articles',
    params
    // Body 参数使用 data 设置
    // Query 参数使用 params 设置
    // Headers 参数使用 headers 设置
  })
}

// 获取文章频道
export const getArticleChannels = () => {
  return request({
    method: 'get',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    // 接口文档中的写的路劲参数需要在 url 中传递
    // 凡是在接口路径中有的 :xxx 格式的字段，则需要传递路径参数
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 发布文章
export const addArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft // 是否存为草稿（true为草稿）
    },
    data
  })
}

// 获取文章内容
export const getArticle = targitId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${targitId}`
  })
}

// 编辑文章（修改）
export const editArticle = (targitId, data, draft) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${targitId}`,
    params: {
      draft
    },
    data
  })
}

// 修改文章评论状态
export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}

// 获取粉丝列表
export const getFans = pramas => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers',
    pramas
  })
}
