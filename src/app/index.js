// 导入koa框架
const Koa = require('koa');

// bodyparser json数据解析
const bodyParser = require('koa-bodyparser');


const path = require('path')

// // 错误处理程序
const errorHandler = require('./error-handle');

// const { CORS_CONFIG } = require('./config');

const useRoutes = require('../router');

//跨域处理
const cors = require('koa2-cors');

// const staticFiles = require('koa-static')

const IO = require('koa-socket');

// 主程序
const app = new Koa();



const io = new IO();



app.useRoutes = useRoutes;
// 激活中间件



io.attach(app);

// json数据解析
app.use(bodyParser());

// cor跨域问题
app.use(cors());

// // 设置静态服务器
// app.use(staticFiles(path.join(__dirname, '../../uploads')))
// // 设置静态服务器
// app.use(staticFiles(path.join(__dirname, '../../public')))
// app.use(staticFiles(path.join(__dirname + '../../public/')))

app.useRoutes(app);

// 和客服端进行连接
io.on('connection', (context) => {
  console.log('一个用户加入了连接');

})

// 接收消息
io.on('sendMsg', function (context) {

  // 广播，所有人消息
  io.broadcast('allmessage', "服务器已经接收你的请求")
  io.broadcast('neworder', context.data)
  io.broadcast('neworderIn', context.data);
})
// 接收消息
io.on('callStaff', function (context) {
  console.log(context.data)
  // 向客服端实时发送消息

  // 广播，所有人消息
  io.broadcast('callStaff', context.data);
})

app.on('error', errorHandler);



module.exports = app;
