import { GET, POST } from '../http';

export function login(data) {
  return POST({
    url: `/user/login`,
    data,
  });
}

export function register(data) {
  return POST({
    url: `/user/register`,
    data,
  });
}

export function info(data) {
  return GET({
    url: `/user/auth`,
    data,
  });
}
