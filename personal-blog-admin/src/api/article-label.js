import request from '@/utils/request';

export function createArticleLabel(data) {
  return request({
    url: '/article-label/create',
    method: 'post',
    data,
  });
}

export function deleteArticleLabel(data) {
  return request({
    url: `/article-label/delete/1`,
    method: 'delete',
    data,
  });
}

export function getArticleLabelList(params) {
  return request({
    url: '/article-label/list',
    method: 'get',
    params,
  });
}
