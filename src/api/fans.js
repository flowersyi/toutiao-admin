/*
  粉丝相关请求模块
*/
import request from '@/utils/request'
// 获取粉丝统计数据
export const getFollowersData = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/statistics/followers'
  })
}
