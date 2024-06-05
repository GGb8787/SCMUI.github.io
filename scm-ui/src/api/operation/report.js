import request from '@/utils/request'

// 查询项目执行进度跟踪报表明细列表
export function listReport(query) {
  return request({
    url: '/operation/report/list',
    method: 'get',
    params: query
  })
}

// 查询项目执行进度跟踪报表明细详细
export function getReport(ptrId) {
  return request({
    url: '/operation/report/' + ptrId,
    method: 'get'
  })
}

// 新增项目执行进度跟踪报表明细
export function addReport(data) {
  return request({
    url: '/operation/report',
    method: 'post',
    data: data
  })
}

// 修改项目执行进度跟踪报表明细
export function updateReport(data) {
  return request({
    url: '/operation/report',
    method: 'put',
    data: data
  })
}

// 删除项目执行进度跟踪报表明细
export function delReport(ptrId) {
  return request({
    url: '/operation/report/' + ptrId,
    method: 'delete'
  })
}

//手动同步数据
export function syncReportData(startDate,endDate) {
  return request({
    url: '/operation/report/asyncTrackReport/'+startDate+'/'+endDate,
    method: 'post',
    timeout: 60 * 60 * 1000,
  })
}

export function getTableData(begin,end){
  return request({
    url: '/operation/report/table/'+begin+'/'+end,
    method: 'get',
  })
}

export function getTableDataLastUpdateTime(){
  return request({
    url: '/operation/report/data/last/time',
    method: 'get',
  })
}

export function getAnalysisGapData(data){
  return request({
    url: '/operation/report/analysis/gap',
    method: 'post',
    data: data
  })
}

export function getAnalysisTargetData(data){
  return request({
    url: '/operation/report/analysis/target',
    method: 'post',
    data: data
  })
}

export function getInProcessData(){
  return request({
    url: '/operation/report/analysis/inProcess/data',
    method: 'get',
  })
}

export function getOrderTypeData(){
  return request({
    url: '/operation/report/analysis/orderType/data',
    method: 'get',
  })
}
