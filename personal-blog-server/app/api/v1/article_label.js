/**
 * @description 文章标签 API 路由
 */
 const Router = require('koa-router');
 const { articleLabelController } = require('@controllers/article_label');
 
 const router = new Router({
   prefix: '/api/v1',
 });
 
 module.exports = router;