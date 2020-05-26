import fetch from '@/utils/fetch';

//患者管理接口

export function pageList(data) {
  return fetch({
    url: '/patient/pageList',
    method: 'post',
    data
  })
}

//注射记录接口
export function injectList(data) {
  return fetch({
    url: '/injectionRecord/pageList',
    method: 'post',
    data
  })
}
