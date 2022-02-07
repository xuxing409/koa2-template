const fs = require('fs');

// 通过文件模块获取所有文件名，然后通过循环请求所有文件
const useRoutes = function () {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return;
    const router = require(`./${file}`);
    this.use(router.routes()); //自动隐式绑定到app
    this.use(router.allowedMethods());
  })
}

module.exports = useRoutes;
