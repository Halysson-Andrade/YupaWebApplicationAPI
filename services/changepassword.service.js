const tb_user = require("../models/tb_users")
const response = require("../models/customresponse");
const moment = require("moment");
let ret = new response();
const bcryptSalt = global.bcryptSalt
const bcrypt = require("bcrypt");

async function ChangePassword(obj) {
  console.log(obj);

  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeSentFromClient = obj.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();

    let existAccount = await tb_user.findOne({
      where: {
        usr_id: obj.usr_id
      },
    });

    if (existAccount.dataValues) {
      let isLogged = bcrypt.compareSync(
        obj.oldPassword.toString().trim(),
        existAccount.dataValues.usr_password.toString().trim()
      );
      //console.log("isLogged", isLogged);
      if (isLogged) {
        if (obj.password != obj.passwordCheck) {
          throw new Error("Senhas não conferem");
        } else {
          existAccount.usr_password = await bcrypt.hash(
            obj.password,
            Number(bcryptSalt)
          );
          existAccount.dataValues.usr_activated = false;
          existAccount.dataValues.usr_changepassword = false;
          const pk = existAccount.dataValues.usr_id;
          delete existAccount.dataValues.usr_id;
          //console.log("pk", pk);
          let retChangePassword = await tb_user.update(
            existAccount.dataValues,
            {
              where: { usr_id: pk },
              returning: true,
              plain: true,
            }
          );
          console.log("retChangePassword", retChangePassword);
          delete retChangePassword[1].dataValues.usr_password;
          console.log("retChangePassword ", retChangePassword[1].dataValues);
          this.ret.data = retChangePassword[1].dataValues;
          this.ret.timeSentFromBack = moment().valueOf();
          this.ret.httpStatus = 200;
        }
      } else {
        throw new Error("Não autorizado, usuário e/ou senha inválidos");
      }
    }
  } catch (error) {
    console.log(error);
    console.log("caiu no erro");
    this.ret.errorCount = 1;
    this.ret.data = {};
    this.ret.httpStatus = 401;
    this.ret.errors.push(error.message);
    this.ret.timeSentFromBack = moment().valueOf();
  }
  return this.ret;
}

module.exports = {
  ChangePassword,
};
