import { GET, PUT } from '../http';

// 获取文章详情
export function getArticleDetail(params) {
  return GET({
    url: `/article/detail/${params.id}`,
    params,
  });
}

// 获取文章列表
export function getArticleList(params) {
  return GET({
    url: '/article/list',
    params,
  });
}

export function updateLikes(data) {
  return PUT({
    url: `/article/like/${data.id}`,
    data,
  });
}
