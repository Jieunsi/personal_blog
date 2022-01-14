const Sequelize = require('sequelize');

const {
  database,
  host,
  port,
  username,
  password,
} = require('@/config/db').database;

const sequelize = new Sequelize(database, username, password, {
  // 连接的数据库
  dialect: 'mysql',
  host,
  port,
  // 定义时区
  timezone: '+08:00',
  // 当使用 sequelize.define 时会使用
  define: {

  },
});

sequelize.sync({ force: false })

sequelize.authenticate().then(res => {
  console.log('Connection established successfully.');
}).catch (err => {
  console.error('Unable to connect to the database:', err);
})

module.exports = {
  sequelize
};