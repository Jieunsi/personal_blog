import request from '@/utils/request';

export function list(params) {
  return request({
    url: '/reply/list',
    method: 'get',
    params,
  });
}

export function create(data) {
  return request({
    url: '/reply/create',
    method: 'post',
    data,
  });
}

export function detail(data) {
  return request({
    url: `/reply/detail/${data.id}`,
    method: 'get',
    data,
  });
}

export function update(data) {
  return request({
    url: `/reply/update/${data.id}`,
    method: 'put',
    data,
  });
}

export function detele(data) {
  return request({
    url: `/reply/delete/${data.id}`,
    method: 'delete',
    data,
  });
}
