const sequelize = require("../config/database");
const tb_user = require("../models/tb_users")
const response = require("../models/customresponse");
const svcRegister = require('../services/register.service')
const moment = require("moment");
const tb_permissions = require("../models/tb_permissions");
const tb_users_permissions = require("../models/tb_users_permissions");
let ret = new response();

exports.create = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    this.ret.timeSentFromClient = req.body.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let result = await svcRegister.newUser(req.body)
    if (result.errorCount > 0) {
      this.ret = result;
      throw Error(result.erros[0]);
    }

    this.ret.data = "Funcionário cadastro com Sucesso!";
    this.ret.timeSentFromBack = moment().valueOf();
    this.ret.httpStatus = 200;
  } catch (error) {
    this.ret.data = {};
    this.ret.errors.push(error.message);
    this.ret.errorCount = this.ret.errors.length;
    this.ret.httpStatus = 400;
  }
  return res.status(this.ret.httpStatus).json(this.ret);
};

exports.destroy = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    this.ret.timeSentFromClient = req.body.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let standardUsers = ['1']
    let hasValue = standardUsers.includes(String(req.params.usr_id));
    if (hasValue) {
      throw Error(
        "Impossível excluir o registro, pois o Usuário é um usuário admin do sistema!"
      );
    }

    let result = await svcRegister.destroyUser(req.params.usr_id);
    if (result.errorCount > 0) {
      this.ret = result;
      throw Error(result.erros[0]);
    }
    this.ret.data = result.data.destroyUser == 1 ? true : false;
    this.ret.timeSentFromBack = moment().valueOf();
    this.ret.httpStatus = 200;
  } catch (error) {
    this.ret.data = {};
    this.ret.errors.push(error.message);
    this.ret.errorCount = this.ret.errors.length;
    this.ret.httpStatus = 400;
  }
  return res.status(this.ret.httpStatus).json(this.ret);
};

exports.read = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    this.ret.timeSentFromClient = req.body.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let users = await tb_user.findAll({});
    if (users.errorCount > 0) {
      this.ret = result;
      throw Error(result.errors[0]);
    }

    let userPermission = await tb_users_permissions.findAll({});
    let result = []
    users.forEach(user => {
      let t = user.dataValues;
      t.permissions = [];
      let permissions = userPermission.filter(up => up.usr_id == user.usr_id)
      permissions.forEach(permission => {
        t.permissions.push(permission.pms_id)
      });
      result.push(t)
    });

    this.ret.data = result;
    this.ret.timeSentFromBack = moment().valueOf();
    this.ret.httpStatus = 200;
  } catch (error) {
    this.ret.data = {};
    this.ret.errors.push(error.message);
    this.ret.errorCount = this.ret.errors.length;
    this.ret.httpStatus = 400;
  }
  return res.status(this.ret.httpStatus).json(this.ret);
};

exports.index = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    this.ret.timeSentFromClient = req.body.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();

    let result = await svcRegister.readOne(req.query.usr_id)
    if (result.errorCount > 0) {
      this.ret = result;
      throw Error(result.errors[0]);
    }
    this.ret.data = []
    this.ret.data.push(result.data);
    this.ret.timeSentFromBack = moment().valueOf();
    this.ret.httpStatus = 200;
  } catch (error) {
    this.ret.data = {};
    this.ret.errors.push(error.message);
    this.ret.errorCount = this.ret.errors.length;
    this.ret.httpStatus = 400;
  }
  return res.status(this.ret.httpStatus).json(this.ret);
};


exports.update = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    this.ret.timeSentFromClient = req.body.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let standardUsers = ['1']
    let hasValue = standardUsers.includes(String(req.body.usr_id));
    if (hasValue) {
      throw Error(
        "Impossível editar o registro, pois o Usuário é um usuário admin do sistema!"
      );
    }
    let result = await svcRegister.updateUser(req.body)
    if (result.errorCount > 0) {
      this.ret = result;
      throw Error(result.erros[0]);
    }

    this.ret.data = "Funcionário alterado com Sucesso!";
    this.ret.timeSentFromBack = moment().valueOf();
    this.ret.httpStatus = 200;
  } catch (error) {
    this.ret.data = {};
    this.ret.errors.push(error.message);
    this.ret.errorCount = this.ret.errors.length;
    this.ret.httpStatus = 400;
  }
  return res.status(this.ret.httpStatus).json(this.ret);
};
