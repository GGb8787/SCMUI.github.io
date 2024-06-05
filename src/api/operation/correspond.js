import request from '@/utils/request'

// 查询产品类型对应列表
export function listCorrespond(query) {
  return request({
    url: '/operation/correspond/list',
    method: 'get',
    params: query
  })
}

// 查询产品类型对应详细
export function getCorrespond(ptcId) {
  return request({
    url: '/operation/correspond/' + ptcId,
    method: 'get'
  })
}

// 新增产品类型对应
export function addCorrespond(data) {
  return request({
    url: '/operation/correspond',
    method: 'post',
    data: data
  })
}

// 修改产品类型对应
export function updateCorrespond(data) {
  return request({
    url: '/operation/correspond',
    method: 'put',
    data: data
  })
}

// 删除产品类型对应
export function delCorrespond(ptcId) {
  return request({
    url: '/operation/correspond/' + ptcId,
    method: 'delete'
  })
}
