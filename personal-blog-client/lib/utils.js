
/**
 * 验证邮箱
 * @param {string} email
 * @returns {Boolean}
 */
 export function validEmail(email) {
  const reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
  return reg.test(email)
}

/**
 * 验证密码
 * @param {string} email
 * @returns {Boolean}
 */
export function validPassword(email) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/
  return reg.test(email)
}

/**
 * 判断是否是数组
 * @param arr
 * @returns {boolean}
 */
export function isArray(arr) {
  return Array.isArray(arr) && arr.length > 0
}

/**
 * 对象数组排序
 * @params arr key order
 * @returns sorted arr
 */
export function sortByKey(arr, key, order) {
  return arr.sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (order) {
      return ((x < y) ? -1 : ((x > y) ? 1 : 0) );
    } else {
      return ((x < y) ? ((x > y) ? 1 : 0) : -1);
    }
  });
}
