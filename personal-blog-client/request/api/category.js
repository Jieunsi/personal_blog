import { GET } from "../http";

// 获取分类列表信息
export function getCategory(params) {
  return GET({
    url: `/sort/list`,
    params
  })
}
