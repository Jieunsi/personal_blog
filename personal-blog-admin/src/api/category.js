import request from '@/utils/request'

// 获取分类列表
export function list(params) {
  return request({
    url: '/sort/list',
    method: 'get',
    params
  })
}

// 创建分类
export function create(data) {
  return request({
    url: '/sort/create',
    method: 'post',
    data
  })
}

// // 获取分类详情
// export function detail(data) {
//   return request({
//     url: '/category/' + data.id,
//     method: 'get',
//     data
//   })
// }

// 更新分类
export function update(data) {
  return request({
    url: '/sort/update' + data.id,
    method: 'put',
    data
  })
}

// 删除分类
export function deleteCategory(data) {
  return request({
    url: '/sort/delete' + data.id,
    method: 'delete',
    data
  })
}
