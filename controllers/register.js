const sequelize = require("../config/database");
const response = require("../models/customresponse");
const moment = require("moment");
let ret = new response();
const svcRegister = require('../services/register.service')
/*
index: Read All
store: Create criar 
show: criar uma única sessão
update: Created alterar 
destroy: deletar 
*/

exports.show = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    this.ret.timeSentFromClient = req.body.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
    
    svcRegister.Register(req.body)
    this.ret.data = 'r.dataValues';
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
