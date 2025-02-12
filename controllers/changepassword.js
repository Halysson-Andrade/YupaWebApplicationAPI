const sequelize = require("../config/database");
const response = require("../models/customresponse");
const moment = require("moment");
let ret = new response();
const svcChangePassword = require("../services/changepassword.service");
const env = require("../config/env");
const jwt = require("jsonwebtoken");
const jwtSecret = global.jwtSecret

exports.update = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];

  try {
    this.ret = await svcChangePassword.ChangePassword(req.body);
    if (Object.keys(this.ret.data).length > 0) {
      var token = jwt.sign(this.ret.data, jwtSecret, { expiresIn: "1h" });
      this.ret.data = {
        token: token,
      };
    }
  } catch (error) {
    this.ret.data = {};
    this.ret.errors.push(error.message);
    this.ret.errorCount = this.ret.errors.length;
    this.ret.httpStatus = 400;
  }
  return res.status(this.ret.httpStatus).json(this.ret);
};
