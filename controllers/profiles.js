const sequelize = require("../config/database");
const tb_user = require("../models/tb_users")
const response = require("../models/customresponse");
const profileServices = require('../services/profile.services')
const moment = require("moment");
const tb_profiles = require("../models/tb_profiles");
const tb_menu_items = require("../models/tb_menu_items");
const tb_profiles_menus = require("../models/tb_profiles_menus");
let ret = new response();

exports.create = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    this.ret.timeSentFromClient = req.body.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let result = await profileServices.newProfile(req.body)
    if (result.errorCount > 0) {
      this.ret = result;
      throw Error(result.erros[0]);
    }

    this.ret.data = "Perfil cadastro com Sucesso!";
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
    let profiles = await tb_profiles.findAll({});
    if (profiles.errorCount > 0) {
      this.ret = profiles;
      throw Error(profiles.errors[0]);
    }

    let profiles_menus = await tb_profiles_menus.findAll({});
    if (profiles_menus.errorCount > 0) {
      this.ret = profiles_menus;
      throw Error(profiles_menus.errors[0]);
    }

    let menus_items = await tb_menu_items.findAll({});
    if (menus_items.errorCount > 0) {
      this.ret = menus_items;
      throw Error(menus_items.errors[0]);
    }

    let result = []
    profiles.forEach(profile => {
      let t = profile.dataValues
      t.profileMenus = [];
      t.menus = [];
      let r = profiles_menus.filter(mnu => mnu.prf_id == profile.prf_id)
      r.forEach(r => {
        t.profileMenus.push(r)
      });      
      //t.profileMenus.push(profiles_menus.filter(mnu => mnu.prf_id == profile.prf_id));
      t.profileMenus.forEach(menu => {
        let parentMenu = menu.mnu_parent_id
        t.menus.push(menus_items.filter(mnu => mnu.mnu_id == parentMenu)[0]);
        let menus = menus_items.filter(mnu => mnu.mnu_parent == parentMenu)
        menus.forEach(menu => {
          t.menus.push(menu)
        })
      })
      delete t.profileMenus;
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
exports.update = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    this.ret.timeSentFromClient = req.body.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let result = await profileServices.updateUser(req.body)
    if (result.errorCount > 0) {
      this.ret = result;
      throw Error(result.erros[0]);
    }
    this.ret.data = "Perfil alterado com Sucesso!";
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
