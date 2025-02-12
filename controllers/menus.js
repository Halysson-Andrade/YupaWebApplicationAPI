const response = require("../models/customresponse");
const moment = require("moment");
const menuService = require("..//services/menus.service")
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

    let menu = await menuService.readMenu()
    if (menu.errorCount > 0) {
      this.ret = menu;
      throw Error(menu.erro[0]);
    }
    this.ret.data = menu.data.readMenus;
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

    let menu = await menuService.createMenu(req.body)
    if (menu.errorCount > 0) {
      this.ret = menu;
      throw Error(menu.erros[0]);
    }
    this.ret.data = menu.data.createMenu;
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
    let standardMenu = ['1', '2', '3', '4', '5']
    let hasValue = standardMenu.includes(String(req.params.mnu_id));
    if (hasValue) {
      throw Error(
        "Impossível deletar o registro, pois o menu é um menu padrão do sistema!"
      );
    }

    let menu = await menuService.destroyMenu(req.params.mnu_id)
    if (menu.errorCount > 0) {
      this.ret = menu;
      throw Error(menu.erros[0]);
    }
    let msg = ''
    if (menu.data.destroyMenu == 1) {
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
    
    let standardMenu = ['1', '2', '3', '4', '5']
    let hasValue = standardMenu.includes(String(req.body.mnu_id));
    if (hasValue) {
      throw Error(
        "Impossível Alterar o registro, pois o menu é uma permissão padrão do sistema!"
      );
    }
    let menu = await menuService.updateMenu(req.body)
    if (menu.errorCount > 0) {
      this.ret = menu;
      throw Error(menu.erro[0]);
    }
    this.ret.data = menu.data.updatedmenu
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
