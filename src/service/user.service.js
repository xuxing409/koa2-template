// service操作数据库
const connection = require("../app/database");
const md5password = require('../utils/passwrod-handle');

class UserService {
  async create(user) {
    // 将user存储到数据库中
    const { name, password, phone, email, isAdmin } = user;

    const statement = `INSERT INTO user (name, password, phone, email, isAdmin) VALUES (?, ?, ?, ?, ?)`;

    const result = await connection.execute(statement, [name, password, phone, email, isAdmin]);

    return result[0];
  }
  // 根据名字获取
  async getUserByName(name) {
    const statement = `SELECT * FROM user WHERE name = ?`;
    const result = await connection.execute(statement, [name]);
    return result[0];
  }
  // 根据查询条件获取用户列表，以及分页数据
  async getUserList(query, pagenum, pagesize) {

    const num = (pagenum - 1) * pagesize;
    let statement = `SELECT * FROM user WHERE name like ?`;
    // 查询总条数
    const Totalresult = await connection.execute(statement, ['%' + query + '%']);

    // 实际分页查询
    statement += ' limit ?,?';
    const result = await connection.execute(statement, ['%' + query + '%', num, pagesize]);

    const users = result[0];


    const Total = Totalresult[0].length;
    const status = 200;
    const msg = '获取用户列表成功';
    const data = {
      pagenum,
      Total,
      users
    };
    const meta = {
      status,
      msg
    }
    return { data, meta };
  }
  // 获得用户表总条数
  async getTotal() {
    const statement = `select count(*) as Total from user`;
    const result = await connection.execute(statement);
    const BinaryRow = result[0];
    const Total = BinaryRow[0].Total;
    return Total;
  }
  // 查询用户是否管理员
  async getIsAdmin(name) {
    const statement = `SELECT isAdmin FROM user WHERE name = ?`;
    const result = await connection.execute(statement, [name]);

    if (result[0].length === 0) {
      return {
        status: 400,
        msg: '用户名不存在'
      }
    }
    return {
      status: 200,
      msg: '查询用户是否管理员成功',
      isAdmin: result[0][0].isAdmin
    }

  }
  // 根据id 修改是否管理员
  async updateAdmin(id, isadmin) {
    const statement = `update user SET isAdmin = ? where id = ?`;

    const result = await connection.execute(statement, [isadmin, id]);

    if (parseInt(result[0].changedRows) == 0) {
      const status = 400;
      const msg = '修改用户是否超级管理员失败';
      const meta = {
        status,
        msg,
        isadmin
      }
      return meta;
    }
    const status = 200;
    const msg = '修改用户是否超级管理员成功';
    const meta = {
      status,
      msg,
      isadmin
    }
    return meta;
  }
  // 根据用户id 修改用户信息
  async updateUser(id, user) {
    if (!id) {
      const msg = "id不能为空"
      const status = 400;
      const meta = {
        status,
        msg
      }
      return meta;
    }

    const statement = `update user SET  email = ?,phone = ? where id = ?`;

    const result = await connection.execute(statement, [user.email, user.phone, id]);

    if (parseInt(result[0].changedRows) === 0) {
      const status = 400;
      const msg = '修改后的信息没有发生变化';
      const meta = {
        status,
        msg
      }
      return meta;
    }
    const status = 200;
    const msg = '修改用户信息成功';
    const meta = {
      status,
      msg
    }
    return meta;
  }
  // 修改密码
  async updatePassword(username, oldPassword, newPassword) {

    const queryPasswordStatement = `SELECT password FROM user WHERE name = ?`
    const userResult = await connection.execute(queryPasswordStatement, [username])

    console.log(userResult[0][0].password);
    console.log(md5password(oldPassword));

    if (md5password(oldPassword) !== userResult[0][0].password) {
      return {
        status: 400,
        msg: '输入的原密码不正确'
      }
    }
    const Password = md5password(newPassword)
    const statement = `update user SET password = ? where name = ?`;

    const result = await connection.execute(statement, [Password, username]);

    if (result[0].affectedRows !== 0) {
      return {
        status: 200,
        msg: '修改密码成功'
      }
    }
    return {
      status: 400,
      msg: '修改密码失败'
    }

  }
  // 根据用户提供的id 删除用户
  async deleteUser(id) {
    const statement = `DELETE FROM user where id = ?`;

    const result = await connection.execute(statement, [id]);

    if (result[0].affectedRows === 0) return {
      msg: '删除用户失败,用户id不存在',
      status: 400
    }
    return {
      msg: '删除用户成功!',
      status: 200
    }
  }
  async getUsersDiscount(query, pagenum, pagesize) {
    const num = (pagenum - 1) * pagesize;
    let statement = `SELECT * FROM discount_rule WHERE user_name like ?`;
    // 查询总条数
    const Totalresult = await connection.execute(statement, ['%' + query + '%']);

    // 实际分页查询
    statement += ' limit ?,?';
    const result = await connection.execute(statement, ['%' + query + '%', num, pagesize]);

    const usersDiscountList = result[0];


    const Total = Totalresult[0].length;
    const status = 200;
    const msg = '获取用户折扣权限列表成功';
    const data = {
      pagenum,
      Total,
      usersDiscountList
    };
    const meta = {
      status,
      msg
    }
    return { data, meta };
  }
  async getAllUser() {
    const statement = `SELECT id,name FROM user`;

    const result = await connection.execute(statement);

    return result[0];
  }
  async addUserDiscount(name, discount, remark) {
    const statement = `INSERT INTO discount_rule(user_name, discount, remark) VALUES(?, ?, ?)`;
    try {
      const result = await connection.execute(statement, [name, discount, remark])
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        msg: '折扣规则已存在，每个人只能设置唯一折扣规则'
      }
    }
    return {
      status: 200,
      msg: '设置' + name + '的折扣规则成功'
    };
  }
  async updateUserDiscount(user_name, discount, remark) {
    const statement = `update discount_rule SET discount = ?, remark = ? where user_name = ?`;
    const result = await connection.execute(statement, [discount, remark, user_name])
    if (result[0].changedRows === 0) {
      return {
        status: 409,
        msg: '修改信息未发生变化'
      }
    }
    return {
      status: 200,
      msg: '修改折扣信息成功'
    }
  }
  async deleteUserDiscount(user_name) {
    const statement = `DELETE FROM discount_rule where user_name = ?`;

    const result = await connection.execute(statement, [user_name]);

    if (result[0].affectedRows === 0) return {
      msg: '删除用户折扣规则失败,用户id不存在',
      status: 400
    }
    return {
      msg: '删除用户折扣规则成功!',
      status: 200
    }
  }
}

module.exports = new UserService();
