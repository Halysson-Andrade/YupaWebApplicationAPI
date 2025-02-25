const tb_table = require("../models/tb_imports")
const s = require("../services/profile.services")
const uploadingAlmani = require("../services/uploadingAlmani.service")
const xls = require('../services/excel.service');
const utils = require('./utils.service')
const { Op } = require('sequelize');
const response = require("../models/customresponse");
const moment = require("moment");
const tb_imports = require("../models/tb_imports");
const tb_imports_datas = require("../models/tb_imports_datas");
const tb_imports_datas_erros = require("../models/tb_imports_datas_erros");

async function read() {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let read = []
    let data = await tb_imports.findAll();
    let dataNoError = await tb_imports_datas.findAll();
    let dataError = await tb_imports_datas_erros.findAll();

    for (let item of data) {
      let totalNoError = dataNoError.filter(x => x.imp_id == item.imp_id).length;
      let totalDataError = dataError.filter(x => x.imp_id == item.imp_id).length;
      
      item.dataValues.total_imported = totalNoError + totalDataError
      item.dataValues.Error = totalDataError
      item.dataValues.ErrorResults = dataError.filter(x => x.imp_id == item.imp_id)
      item.dataValues.noErrorResults = dataNoError.filter(x => x.imp_id == item.imp_id)

      read.push(item.dataValues )
    }
    this.ret.data = { read };
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

async function readData() {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let read = []
    read = await tb_imports_datas.findAll({})
    this.ret.data = {read};
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
    await tb_table.update({ imp_status: 0 }, { where: {} });
    
    let create = await tb_table.create({
      imp_status: 1,
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
    create.imp_name = `id_${create.imp_id}_${obj.fileName}`
    await create.save();

    let dataResponse = await xls.readExcelFile(obj.base64, 0);
    if (dataResponse.errorCount > 0) {
      ret.errors = dataResponse.errors;
      ret.httpStatus = 400;
      throw new Error(dataResponse.errors[0]);
    }

    let importationToCreate = await uploadingAlmani.create(dataResponse, create);
    if (importationToCreate.errorCount > 0) {
      this.ret = importationToCreate;
      throw Error(importationToCreate.errors[0]);
    }

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

module.exports = {
  create,
  destroy,
  read,
  update,
  readData
};
