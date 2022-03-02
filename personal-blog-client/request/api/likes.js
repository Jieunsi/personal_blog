import { GET, POST } from '../http';

// 判断是否点赞
export function liked(params) {
  return GET({
    url: '/likes/liked',
    params,
  });
}

// 点赞
export function like(data) {
  return POST({
    url: '/likes/like',
    data,
  });
}

// 取消点赞
export function unlike(data) {
  return POST({
    url: '/likes/unlike',
    data,
  });
}

// 获取已点赞的文章
export function getLikeArticleList(params) {
  return GET({
    url: '/likes/likeArticleList',
    params,
  });
}
