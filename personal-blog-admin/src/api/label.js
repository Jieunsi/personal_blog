import request from '@/utils/request';

export function createLabel(data) {
  return request({
    url: '/label/create',
    method: 'post',
    data,
  });
}

export function deleteLabel(data) {
  return request({
    url: `/label/delete/${data.id}`,
    method: 'delete',
    data,
  });
}

export function labelList(params) {
  return request({
    url: '/label/list',
    method: 'get',
    params,
  });
}

export function updateLabel(data) {
  return request({
    url: `/label/update/${data.id}`,
    method: 'put',
    data
  })
}
