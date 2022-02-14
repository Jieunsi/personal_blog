import Cookies from 'js-cookie';
const LOGIN_TOKEN = process.env.LOGIN_TOKEN;

export function getToken() {
  return Cookies.get(LOGIN_TOKEN);
}

export function setToken(token) {
  return Cookies.set(LOGIN_TOKEN, token);
}

export function removeToken() {
  return Cookies.remove(LOGIN_TOKEN);
}
