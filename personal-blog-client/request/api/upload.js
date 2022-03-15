import { POST } from '../http';

export function getToken(params) {
  return POST({
    url: `/upload/token`,
    params
  })
}
