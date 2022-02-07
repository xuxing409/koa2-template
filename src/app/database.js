// 1. 引入数据库操作mysql2,建立连接
// const mysql = require('mysql2');

const config = require('./config')


// const connections = mysql.createPool({
//   host: config.MYSQL_HOST,
//   port: config.MYSQL_PORT,
//   database: config.MYSQL_DATABASE,
//   user: config.MYSQL_USER,
//   password: config.MYSQL_PASSWORD
// })

// connections.getConnection((err, conn) => {
//   conn.connect((err) => {
//     if (err) {
//       console.log("连接失败:", err);
//     } else {
//       console.log("数据库连接成功");
//     }
//   })
// });

// 2. 引入数据库操作mssql,建立连接
const sql = require('mssql')

// 创建连接池
const connections = new sql.ConnectionPool({

  server: config.MSSQL_SERVER,
  port: Number(config.MSSQL_PORT),
  database: config.MSSQL_DATABASE,
  user: config.MSSQL_USER,
  password: config.MSSQL_PASSWORD,

  options: {
    encrypt: false
  }
})
connections.connect((err, conn) => {
  if (err) {
    console.log("连接失败:", err);
  } else {
    console.log("数据库连接成功");
  }

});
module.exports = connections;
