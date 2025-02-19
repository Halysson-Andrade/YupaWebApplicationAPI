const tb_user = require("../models/tb_users");
const tb_users_permissions = require("../models/tb_users_permissions");
const response = require("../models/customresponse");
const ret = new response();
const svcMail = require("./sendmail.service");
const moment = require("moment");
const bcryptSalt = global.bcryptSalt;
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const shortid = require("shortid");

async function newUser(usr) {
  let ret
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    let existEmail = await tb_user.findOne({
      where: {
        usr_email: usr.usr_email,
      },
    });
    let tempPassword = shortid.generate();
    if (!existEmail) {
      let usrToCreate = usr
      usr.usr_password = await bcrypt.hash(tempPassword, Number(bcryptSalt));
      usr.usr_activationcode = tempPassword;
      usr.usr_activated = false;
      usr.usr_changepassword = true;
      usr.usr_status = true;
      usrToCreate.usr_password = usr.usr_password
      usrToCreate.usr_activationcode = usr.usr_activationcode
      usrToCreate.usr_activated = usr.usr_activated
      usrToCreate.usr_changepassword = usr.usr_changepassword
      usrToCreate.usr_changepassword = usr.usr_changepassword

      ret = await tb_user.create(usrToCreate);

      let permissions = []
      let user_permissions = []
      permissions = usr.pms_id
      permissions.forEach(permission => {
        let t = {}
        t.usr_id = ret.usr_id
        t.pms_id = permission
        user_permissions.push(t)
      });


      await tb_users_permissions.bulkCreate(user_permissions)

      let html = fs.readFileSync(
        path.resolve("./templates", "account_createbyadm.html")
      );
      let message = html
        .toString()
        .replaceAll("[email]", ret.dataValues.usr_email)
        .replaceAll("[password]", tempPassword);
      let sent = await svcMail.Send(
        "Registro de contas",
        ret.dataValues.usr_email,
        "Registro de conta",
        "Registro",
        message
      );
    } else {
      this.ret.errorCount = 1;
      this.ret.data = {};
      this.ret.httpStatus = 401;
      this.ret.errors.push('E-mail do usuário existente');
      this.ret.timeSentFromBack = moment().valueOf();
      return this.ret;
    }
  } catch (error) {
    this.ret.errorCount = 1;
    this.ret.data = {};
    this.ret.httpStatus = 401;
    this.ret.errors.push('E-mail do usuário existente');
    this.ret.timeSentFromBack = moment().valueOf();
  }
  return this.ret;
}

async function readOne(id) {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let read = []
    let user = await tb_user.findByPk(id);
    user.dataValues.permissions = []
    user.dataValues.systems = []

    let permissions = await tb_users_permissions.findAll({
      where: {
        usr_id: user.usr_id
      }
    });

    permissions.forEach(element => {
      let id = element.pms_id
      user.dataValues.permissions.push(id)
    });

    read = user
    this.ret.data = read;
    this.ret.timeSentFromBack = moment().valueOf();
    this.ret.httpStatus = 200;
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

async function updateUser(usr) {
  let ret
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    let existUser = await tb_user.findByPk(usr.usr_id);
    if (existUser) {
      let usrToUpdate = usr
      existUser.usr_profile = usrToUpdate.usr_profile
      existUser.usr_name = usrToUpdate.usr_name
      ret = await existUser.save();

      await tb_users_permissions.destroy({
        where: {
          usr_id: usrToUpdate.usr_id
        }
      });

      let permissions = []
      let user_permissions = []
      permissions = usr.pms_id
      permissions.forEach(permission => {
        let t = {}
        t.usr_id = ret.usr_id
        t.pms_id = permission
        user_permissions.push(t)
      });
      await tb_users_permissions.bulkCreate(user_permissions)
    } else {
      this.ret.errorCount = 1;
      this.ret.data = {};
      this.ret.httpStatus = 401;
      this.ret.errors.push('ID do usuário não localizado!');
      this.ret.timeSentFromBack = moment().valueOf();
      return this.ret;
    }
  } catch (error) {
    this.ret.errorCount = 1;
    this.ret.data = {};
    this.ret.httpStatus = 401;
    this.ret.errors.push('Usuário não localizado!');
    this.ret.timeSentFromBack = moment().valueOf();
  }
  return ret;
}

async function destroyUser(usr) {
  let ret
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    let destroyUser = await tb_user.destroy({
      where: {
        usr_id: usr,
      },
    });

    this.ret.data = { destroyUser };
    this.ret.timeSentFromBack = moment().valueOf();
    this.ret.httpStatus = 200;

  } catch (error) {
    this.ret.errorCount = 1;
    this.ret.data = {};
    this.ret.httpStatus = 401;
    this.ret.errors.push('E-mail do usuário existente');
    this.ret.timeSentFromBack = moment().valueOf();
  }
  return this.ret;
}
module.exports = {
  newUser,
  destroyUser,
  updateUser,
  readOne
};
