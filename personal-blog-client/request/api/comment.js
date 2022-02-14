import { GET, POST } from '../http';

// 创建评论
export function createComment(data) {
  return POST({
    url: `/comment/create`,
    data,
  });
}

export function getCommentTarget(params) {
  return GET({
    url: `/comment/target/list`,
    params,
  });
}
