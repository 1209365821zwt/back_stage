import fetch from '@/utils/fetch';

//反馈接口

//反馈意见列表
export function pageList(data) {
  return fetch({
    url: '/feedback/pageList',
    method: 'post',
    data
  })
}