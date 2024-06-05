import request from '@/utils/request'

// 查询车间和工厂对照列表
export function listWfcorrespond(query) {
  return request({
    url: '/operation/wfcorrespond/list',
    method: 'get',
    params: query
  })
}

// 查询车间和工厂对照详细
export function getWfcorrespond(wfcId) {
  return request({
    url: '/operation/wfcorrespond/' + wfcId,
    method: 'get'
  })
}

// 新增车间和工厂对照
export function addWfcorrespond(data) {
  return request({
    url: '/operation/wfcorrespond',
    method: 'post',
    data: data
  })
}

// 修改车间和工厂对照
export function updateWfcorrespond(data) {
  return request({
    url: '/operation/wfcorrespond',
    method: 'put',
    data: data
  })
}

// 删除车间和工厂对照
export function delWfcorrespond(wfcId) {
  return request({
    url: '/operation/wfcorrespond/' + wfcId,
    method: 'delete'
  })
}
