module.exports = {
  environment: 'dev',
  database: {
    database: 'blog_db',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'chenzhijie'
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时
    expiresIn: 60 * 60
  }
}
