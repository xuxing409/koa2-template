const dotenv = require('dotenv');
const fs = require('fs');
// 环境变量配置文件
dotenv.config();

// const PRIVATE_KEY = fs.readFileSync('src/app/keys/private.key');
// const PUBLIC_KEY = fs.readFileSync('src/app/keys/public.key');

const CORS_CONFIG = {
  orgin: () => 'http://localhost:8080',//跨域允许的端口
  header: "Access-Control-Allow-Origin",
  creadentials: true,//是否允许cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Authorization'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']  //允许添加到header的字段
}

module.exports = {
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD
} = process.env

// module.exports.PRIVATE_KEY = PRIVATE_KEY;
// module.exports.PUBLIC_KEY = PUBLIC_KEY;
module.exports.CORS_CONFIG = CORS_CONFIG;
