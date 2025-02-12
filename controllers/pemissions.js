const response = require("../models/customresponse");
const moment = require("moment");
const permissionService = require("..//services/pemissions.service")
let ret = new response();
/*
index: Read All
store: Create criar 
show: criar uma única sessão
update: Created alterar 
destroy: deletar 
*/

exports.index = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    this.ret.timeSentFromClient = req.body.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();

    let permission = await permissionService.readPermission()
    if (permission.errorCount > 0) {
      this.ret = permission;
      throw Error(permission.erro[0]);
    }
    this.ret.data = permission.data.readPermissions;
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

exports.store = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    this.ret.timeSentFromClient = req.body.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();

    let permission = await permissionService.createPermission(req.body)
    if (permission.errorCount > 0) {
      this.ret = permission;
      throw Error(permission.erros[0]);
    }
    this.ret.data = permission;
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
    let standardPermissions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
    let hasValue = standardPermissions.includes(String(req.params.pms_id));
    if (hasValue) {
      throw Error(
        "Impossível deletar o registro, pois a permissão é uma permissão padrão do sistema!"
      );
    }

    let permission = await permissionService.destroyPermission(req.params.pms_id)
    if (permission.errorCount > 0) {
      this.ret = permission;
      throw Error(permission.erros[0]);
    }
    let msg = ''
    if (permission.data.destroyPermission == 1) {
      msg = 'Registro deletado com sucesso'
    } else {
      msg = 'Registro não localizado na base'
    }
    this.ret.data = { message: msg };
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
    
    let standardPermissions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
    let hasValue = standardPermissions.includes(String(req.body.pms_id));
    if (hasValue) {
      throw Error(
        "Impossível Alterar o registro, pois a permissão é uma permissão padrão do sistema!"
      );
    }
    let permission = await permissionService.updatePermission(req.body)
    if (permission.errorCount > 0) {
      this.ret = permission;
      throw Error(permission.erro[0]);
    }
    this.ret.data = permission.data.updatePermissions
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
