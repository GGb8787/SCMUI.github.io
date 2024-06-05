import request from '@/utils/request'

// 查询销售订单明细列表
export function listOrderDetail(query) {
  return request({
    url: '/sale/orderDetail/list',
    method: 'get',
    params: query
  })
}

// 查询销售订单明细详细
export function getOrderDetail(id) {
  return request({
    url: '/sale/orderDetail/' + id,
    method: 'get'
  })
}

// 新增销售订单明细
export function addOrderDetail(data) {
  return request({
    url: '/sale/orderDetail',
    method: 'post',
    data: data
  })
}

// 修改销售订单明细
export function updateOrderDetail(data) {
  return request({
    url: '/sale/orderDetail',
    method: 'put',
    data: data
  })
}

// 删除销售订单明细
export function delOrderDetail(id) {
  return request({
    url: '/sale/orderDetail/' + id,
    method: 'delete'
  })
}

export function asyncAddSalesData(){
  return request({
    url: '/sale/orderDetail/asyncAddSalesData',
    method: 'post',
    timeout: 60 * 60 * 1000,
  })
}

// 查询当年每月销售总额
  export function getOrderNumByMonth(year,query) {
    return request({
      url: '/sale/saleChart/getOrderPrice/' + year,
      method: 'get',
      params: query,
    })
}

// 查询销售缓存数据
export function getSaleCacheData() {
  return request({
    url: '/sale/saleChart/getSaleCache',
    method: 'get'
  })
}

// 查询当年每月销售量
export function getSaleNumData(year,salesOrg,analysisWay) {
  return request({
    url: '/sale/saleChart/getSaleNum/'+year+'/'+salesOrg+'/'+analysisWay,
    method: 'get',
  })
}

export function getOrderNumByMonthTable(year){
  return request({
    url: '/sale/saleChart/getOrderPriceTable/'+year,
    method: 'get',
  })
}
