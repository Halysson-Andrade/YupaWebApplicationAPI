const tb_user = require("../models/tb_users")
const response = require("../models/customresponse");
const moment = require("moment");
let ret = new response();
const bcrypt = require("bcrypt");
const svcMenu = require('./menus.service')
async function Login(obj) {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeSentFromClient = obj.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let existAccount = await tb_user.findOne({
      where: {
        usr_email: obj.email,
      },
    });

    if (existAccount) {
      let hashPassword = obj.password;
      
      let isLogged = bcrypt.compareSync(
        obj.password.toString().trim(),
        existAccount.dataValues.usr_password.toString().trim()
      );

      
      if (isLogged) {
        delete existAccount.dataValues.usr_password;
        this.ret.timeSentFromClient = obj.timeSentFromClient;
        this.ret.timeReceivedFromBack = moment().valueOf();
        delete existAccount.dataValues.usr_password;
        
        let menuRoles = await svcMenu.GetMenus(existAccount.dataValues);
        
        existAccount.dataValues['roles'] = menuRoles.data.roles;
        existAccount.dataValues["menus"] = menuRoles.data.menus;
        
        this.ret.data = existAccount.dataValues;
        this.ret.timeSentFromBack = moment().valueOf();
        this.ret.httpStatus = 200;
        
      } else {
        throw new Error("Não autorizado, usuário e/ou senha inválidos");
      }
    } else {
      throw new Error("Não autorizado, conta inexistente");
    }
  } catch (error) {
    console.log(error);
    this.ret.errorCount = 1;
    this.ret.data = {};
    this.ret.httpStatus = 401;
    this.ret.errors.push(error.message);
    this.ret.timeSentFromBack = moment().valueOf();
  }
  
  return this.ret;
}

module.exports = {
  Login,
};
