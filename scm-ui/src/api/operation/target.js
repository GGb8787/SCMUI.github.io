import request from '@/utils/request'

// 查询目标值配置列表
export function listTarget(query) {
  return request({
    url: '/operation/target/list',
    method: 'get',
    params: query
  })
}

// 查询目标值配置详细
export function getTarget(tarId) {
  return request({
    url: '/operation/target/' + tarId,
    method: 'get'
  })
}

// 新增目标值配置
export function addTarget(data) {
  return request({
    url: '/operation/target',
    method: 'post',
    data: data
  })
}

// 修改目标值配置
export function updateTarget(data) {
  return request({
    url: '/operation/target',
    method: 'put',
    data: data
  })
}

// 删除目标值配置
export function delTarget(tarId) {
  return request({
    url: '/operation/target/' + tarId,
    method: 'delete'
  })
}
