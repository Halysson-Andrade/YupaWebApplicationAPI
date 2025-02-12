const sequelize = require("../config/database");
const response = require("../models/customresponse");
const moment = require("moment");
let ret = new response();
const svcForgot = require("../services/forgot.service");

exports.update = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];
  try {
    let retForgot = await svcForgot.Forgot(req.body);
    if (retForgot.errorCount >0){
      this.ret = retForgot;
      throw new Error(toa.errors[0]);
    }
    this.ret = retForgot;
  } catch (error) {
    this.ret.data = {};
    this.ret.errors.push(error.message);
    this.ret.errorCount = this.ret.errors.length;
    this.ret.httpStatus = 400;
  }
  return res.status(this.ret.httpStatus).json(this.ret);
};
