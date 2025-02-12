const tb_users = require("../models/tb_users")
const response = require("../models/customresponse");
const svcMail = require("./sendmail.service");
const moment = require("moment");
let ret = new response();
const randomstring = require("randomstring");
const bcryptSalt = global.bcryptSalt
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
async function Forgot(obj) {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  this.ret.timeSentFromClient = obj.timeSentFromClient;
  this.ret.timeReceivedFromBack = moment().valueOf();
  try {    
    let existAccount = await tb_users.findOne({
      where: {
        usr_email: obj.email,
      },
    });
    
    if (existAccount) {
      let newPassword = randomstring.generate(7);
      existAccount.usr_changepassword = true;
      existAccount.usr_activated = false;

      existAccount.dataValues.usr_password = await bcrypt.hash(
        newPassword,
        Number(bcryptSalt)
      );
      
      let pk = existAccount.dataValues.usr_id;
      delete existAccount.dataValues.usr_id;
      let retUpdate = await tb_users.update(existAccount.dataValues, {
        where: { usr_id: pk },
        returning: true,
        plain: true,
      });
      
      let html = fs.readFileSync(
        path.resolve("./templates", "account_resetpassword.html")
      );
      let message = html.toString().replaceAll("[password]", newPassword);
      await svcMail.Send(
        "Alteração de contas",
        existAccount.dataValues.usr_email,
        "Alteração de senha",
        "Senhas",
        message
      );
      
      this.ret.data = retUpdate ? { sent: true } : { sent: false };
      this.ret.httpStatus = 200;
      this.ret.timeSentFromBack = moment().valueOf();
    } else {
      this.ret.data = {};
      this.ret.errors.push("Falha de autenticação");
      this.ret.errorCount = 1;
      this.ret.httpStatus = 400;
      this.ret.timeSentFromBack = moment().valueOf();
    }
  } catch (error) {
    console.log(error);
    this.ret.data = {};
    this.ret.errors.push(error.message);
    this.ret.errorCount = 1;
    this.ret.httpStatus = 400;
    this.ret.timeSentFromBack = moment().valueOf();
  }
  return this.ret;
}

module.exports = {
  Forgot,
};
