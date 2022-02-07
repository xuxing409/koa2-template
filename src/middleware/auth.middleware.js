const jwt = require('jsonwebtoken');
const errorTypes = require('../constants/error-types');

const service = require('../service/user.service');
const md5password = require('../utils/passwrod-handle');
const { PUBLIC_KEY } = require('../app/config');

// 登录验证
const verifyLogin = async (ctx, next) => {
  // 1.获取用户名和密码
  const { name, password } = ctx.request.body;
  // 2.判断用户名和密码是否为空
  if (!name || !password) {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);//发出密码为空错误事件

    console.log(error);

    return ctx.app.emit('error', error, ctx);
  }
  // 3.判断用户是否存在（用户不存在）
  const result = await service.getUserByName(name);
  const user = result[0];
  if (!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS); //发出用户不存在事件
    return ctx.app.emit('error', error, ctx);
  }
  // 4.判断密码是否和数据库中的密码一致（加密）
  if (md5password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);//发出密码不一致事件
    return ctx.app.emit('error', error, ctx);
  }
  ctx.user = user;
  await next();
}

// token非对称加密验证
const verifyAuth = async (ctx, next) => {
  console.log("验证授权的middleware");
  // 1.获取token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    ctx.app.emit('error', error, ctx);
  }
  const token = authorization.replace('Bearer ', '');

  // 2.验证token(id/name/iat/exp)
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    });
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    ctx.app.emit('error', error, ctx);
  }
}

module.exports = {
  verifyLogin,
  verifyAuth
}
