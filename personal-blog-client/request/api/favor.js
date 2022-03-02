import { GET, POST } from '../http';

// 判断是否收藏
export function hasFavorite(params) {
  return GET({
    url: '/favor/hasFavorite',
    params,
  });
}

// 点赞
export function favor(data) {
  return POST({
    url: '/favor/favor',
    data,
  });
}

// 获取已收藏的文章
export function getFavorArticleList(params) {
  return GET({
    url: '/favor/favorArticleList',
    params,
  });
}
