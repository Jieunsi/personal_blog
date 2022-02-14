import Vue from 'vue';
import { removeToken, getToken } from '~/lib/auth';

export default ({ $axios, store }) => {
  $axios.onRequest((config) => {
    config.headers.Authorization = getToken();
  });

  $axios.onResponse((res) => {
    if (res.status === 200 && res.data.code === 200) {
      return res;
    } else {
      Vue.prototype.$message.error(res.data.msg || '请求失败');
      return Promise.reject(res);
    }
  });

  $axios.onError((err) => {
    const { response } = err;

    // token过期或无效
    if ([401, 403].includes(response.status)) {
      removeToken();
      store.commit('user/SET_LOGIN_STATUS', false);
      store.commit('user/SET_USERINFO', null);
    }

    const msg = Array.isArray(response.data.msg)
      ? response.data.msg.join(',')
      : response.data.msg;
    Vue.prototype.$message.error(msg || '获取失败');
    return Promise.reject(err);
  });
};
