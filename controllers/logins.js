const response = require("../models/customresponse");
const moment = require("moment");
let ret = new response();
let svcLogin = require("../services/login.service");
const env = require("../config/env");
const jwt = require("jsonwebtoken");
const jwtSecret = global.jwtSecret;
exports.auth = async (req, res) => {
  this.ret = new response();
  this.ret.errorCount = 0;
  this.ret.errors = [];

  try {
    let retLogin = await svcLogin.Login(req.body);
    
    if (Object.keys(retLogin.data).length > 0) {
      var token = jwt.sign(retLogin.data, jwtSecret, { expiresIn: "12h" });      
      this.ret = retLogin;
      this.ret.data = {
        token: token,
      };
    }
	else
	{
		this.ret = retLogin
	}
  } catch (error) {
    console.log("xcaiu no erro", error.message);
    this.ret.data = {};
    this.ret.errors.push(error.message);
    this.ret.errorCount = this.ret.errors.length;
    this.ret.httpStatus = 400;
  }
  return res.status(this.ret.httpStatus).json(this.ret);
};
