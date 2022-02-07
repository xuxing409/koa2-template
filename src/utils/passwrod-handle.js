const crypto = require('crypto');

const md5password = (password) => {
  const md5 = crypto.createHash('md5');//创建一个md5哈希算法
  const result = md5.update(password).digest('hex');//对密码进行加密,然后转换为16进制
  return result;
}

module.exports = md5password;

