const tb_table = require("../models/tb_imports")
const s = require("../services/profile.services")
const xls = require('../services/excel.service');
const utils = require('./utils.service')
const { Op } = require('sequelize');
const response = require("../models/customresponse");
const moment = require("moment");

async function read() {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let data = {}
    data.imp_status =0
    data.imp_name ='teste'
    data.imp_container_name ='imp_container_name'
    data.imp_blob_path ='imp_blob_path'
    data.total_imported =0
    data.Error =0
    data.ErrorResults =[{teste:'teste'}]
    data.noErrorResults =[{teste:'teste'}]

    let read =[]
    read.push(data)
    this.ret.data =  {read} ;
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

async function readOne(brc_id) {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();

    this.ret.data = {};
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

async function update(obj) {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();

    this.ret.data = {};
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

async function create(obj) {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeSentFromClient = obj.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();

    let importation = [];
    let imp_container_name = 'vexia';

    let create = await tb_table.create({
      imp_status: 0,
      imp_name: '',
      imp_container_name: 'vexia',
      imp_blob_path: '',
      imp_folder_name: '/almani/importações',
    });

    let fileUrl = await utils.uploadExcelToBlob(
      "vexia",
      "/almani/importações",
      `id_${create.ali_id}_${obj.fileName}`,
      obj.fileType,
      obj.base64
    );

    create.imp_blob_path = fileUrl
    create.imp_name =`id_${create.imp_id}_${obj.fileName}`
    await create.save();

    let dataResponse = await xls.readExcelFile(obj.base64, 0);
    if (dataResponse.errorCount > 0) {
      ret.errors = dataResponse.errors;
      ret.httpStatus = 400;
      throw new Error(dataResponse.errors[0]);
    }

    /*let employeeImportation = await s.create(dataResponse, create);
    if (employeeImportation.errorCount > 0) {
      this.ret = employeeImportation;
      throw Error(employeeImportation.errors[0]);
    }*/

    this.ret.data = { result: true };
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

async function destroy(obj) {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeSentFromClient = obj.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    
    this.ret.data = {  };
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
  create,
  destroy,
  read,
  update,
  readOne
};
