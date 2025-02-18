const response = require("../models/customresponse");
const moment = require("moment");
const s = require("..//services/uploads.services")
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

    let result = await s.read()
    if (result.errorCount > 0) {
      this.ret = result;
      throw Error(result.errors[0]);
    }
    this.ret.data = result.data.read;
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

    let result = await s.readOne(req.query.brc_id)
    if (result.errorCount > 0) {
      this.ret = result;
      throw Error(result.errors[0]);
    }
    this.ret.data = result.data.read;
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

    let result = await s.create(req.body)
    if (result.errorCount > 0) {
      this.ret = result;
      throw Error(result.errors[0]);
    }
    this.ret.data = result.data.create;
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
   
    let result = await s.destroy(req.query.brc_id)
    if (result.errorCount > 0) {
      this.ret = result;
      throw Error(result.errors[0]);
    }
    let msg = ''
    if (result.data.destroy == 1) {
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
    let result = await s.update(req.body)
    if (result.errorCount > 0) {
      this.ret = result;
      throw Error(result.errors[0]);
    }
    this.ret.data = result.data.update
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
