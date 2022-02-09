import request from '@/utils/request';

export function create(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function list(params) {
  return request({
    url: '/article/list',
    method: 'get',
    params
  })
}

export function deleteArticle(data) {
  return request({
    url: `/article/delete/${data.id}`,
    method: 'delete',
    data
  })
}

export function update(data) {
  return request({
    url: `/article/update/${data.id}`,
    method: 'put',
    data
  })
}

export function detail(data) {
  return request({
    url: `/article/detail/${data.id}`,
    method: 'get',
    data
  })
}
