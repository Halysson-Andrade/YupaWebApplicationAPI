const tb_users = require("../models/tb_users");
const tb_profiles_menus = require("../models/tb_profiles_menus");
const tb_menu_items = require("../models/tb_menu_items");
const tb_users_permissions = require("../models/tb_users_permissions");
const { Op } = require('sequelize');
const response = require("../models/customresponse");
const moment = require("moment");
async function GetMenus(obj) {
  try {    
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeSentFromClient = obj.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let user = await tb_users.findByPk(obj.usr_id)
    let user_profile = await tb_profiles_menus.findAll({
      where:{
        prf_id: user.usr_profile 
      }
    });
    let parentMenus =[]
   // let menus =[]
    user_profile.forEach(menu =>{
      parentMenus.push(menu.mnu_parent_id);
    }) 

    let user_menus = await tb_menu_items.findAll({
      where: {
        [Op.or]: [
          { mnu_parent: { [Op.in]: parentMenus } },
          { mnu_id: { [Op.in]: parentMenus } }
        ]
      }
    });

    let roles = await tb_users_permissions.findAll({
      where:{
        usr_id: obj.usr_id
      }
    })

    this.ret.data = {
      roles: roles,
      menus: user_menus,
    };
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
async function readMenu() {
  try {    
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let readMenus = await tb_menu_items.findAll({})

    this.ret.data = {readMenus};
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

async function updateMenu(obj) {
  try {    
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let menuDataToUpdate = obj 
    let menuToUpdate = await tb_menu_items.findByPk(menuDataToUpdate.mnu_id)
    
    menuToUpdate.mnu_label = menuDataToUpdate.mnu_label
    menuToUpdate.mnu_icon = menuDataToUpdate.mnu_icon
    menuToUpdate.mnu_parent = menuDataToUpdate.mnu_parent
    menuToUpdate.mnu_routerlink = menuDataToUpdate.mnu_routerlink
    menuToUpdate.mnu_li_app_menuitem = menuDataToUpdate.mnu_li_app_menuitem
    menuToUpdate.mnu_class = menuDataToUpdate.mnu_class

    let updatedmenu = await menuToUpdate.save();

    this.ret.data = {updatedmenu};
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

async function createMenu(obj) {
  try {    
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeSentFromClient = obj.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let manuToCreate = obj
    let createMenu = await tb_menu_items.create(manuToCreate)

    this.ret.data = {createMenu};
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

async function destroyMenu(obj) {
  try {    
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeSentFromClient = obj.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let menuToDestroy = obj
    let destroyMenu = await tb_menu_items.destroy({
      where: { mnu_id: menuToDestroy },
      returning: true,
      plain: true,})

    this.ret.data = {destroyMenu};
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

module.exports = {
  GetMenus,
  updateMenu,
  destroyMenu,
  createMenu,
  readMenu,
};
