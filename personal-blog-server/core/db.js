const Sequelize = require('sequelize');

const { database, host, port, username, password } =
  require('@/config/db').database;

const sequelize = new Sequelize(database, username, password, {
  // 连接的数据库
  dialect: 'mysql',
  host,
  port,
  // 定义时区
  timezone: '+08:00',
  // 当使用 sequelize.define 时会使用
  define: {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    // 删除改为添加删除时间，即逻辑删除
    paranoid: true,
    // 冻结表名
    freezeTableName: true,
    // 从结果排除下列属性
    scopes: {
      bh: {
        attributes: {
          exclude: ['password', 'updated_at', 'deleted_at', 'created_at'],
        },
      },
      iv: {
        attributes: {
          exclude: ['content', 'password', 'updated_at', 'deleted_at'],
        },
      },
    },
  },
});

// 是否同步数据（是否删除原有同名表）
sequelize.sync({ force: false });

sequelize
  .authenticate()
  .then((res) => {
    console.log('Connection established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {
  sequelize,
};
