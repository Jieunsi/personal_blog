const Router = require('koa-router');
const requireDirectory = require('require-directory');
/**
 * @description初始化项目
 *  自动加载路由
 *  加载配置
 *  配置全局错误
 */
class InitManager {
  // 统一初始化方法
  static init(app) {
    InitManager.app = app;
    InitManager.loadRouters();
    InitManager.loadConfig();
    InitManager.loadHttpException();
  }

  // 加载路由
  static loadRouters() {
    const apiDirectory = `${process.cwd()}/app/api/v1`;
    requireDirectory(module, apiDirectory, {
      visit: isRouters,
    });

    // 判断是否路由,仅适用于直接导出 router 的情况
    function isRouters(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes(), obj.allowedMethods());
      }
    }
  }

  static loadConfig(path = '') {
    const configPath =
      path || process.cwd() + '/config/db.js';
    const config = require(configPath);
    global.config = config;
  }

  static loadHttpException() {
    const errors = require('./http-exception');
    global.errs = errors;
  }
}

module.exports = InitManager;
