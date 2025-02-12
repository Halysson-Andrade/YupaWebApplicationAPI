const tb_permissions = require ("../models/tb_permissions")
const { Op } = require('sequelize');
const response = require("../models/customresponse");
const moment = require("moment");
const permissions = require("../routes/permissions");

async function readPermission() {
  try {    
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let readPermissions = await tb_permissions.findAll({})

    this.ret.data = {readPermissions};
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

async function updatePermission(obj) {
  try {    
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let permissionDataToUpdate = obj 
    let permissionToUpdate = await tb_permissions.findByPk(permissionDataToUpdate.pms_id)
    
    permissionToUpdate.pms_action = permissionDataToUpdate.pms_action
    permissionToUpdate.pms_description = permissionDataToUpdate.pms_description
    permissionToUpdate.pms_status = permissionDataToUpdate.pms_status
    permissionToUpdate.pms_status_mnu = permissionDataToUpdate.pms_status_mnu

    let updatePermissions = await permissionToUpdate.save();

    this.ret.data = {updatePermissions};
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

async function createPermission(obj) {
  try {    
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeSentFromClient = obj.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let permissionToCreate = obj
    let createPermission = await tb_permissions.create(permissionToCreate)

    this.ret.data = {createPermission};
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

async function destroyPermission(obj) {
  try {    
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeSentFromClient = obj.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    let permissionToDestroy = obj
    let destroyPermission = await tb_permissions.destroy({
      where: { pms_id: permissionToDestroy },
      returning: true,
      plain: true,})

    this.ret.data = {destroyPermission};
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
  createPermission,
  destroyPermission,
  readPermission,
  updatePermission
};
