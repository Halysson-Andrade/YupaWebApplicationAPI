const sequelize = require("../config/database");
const response = require("../models/customresponse");
const moment = require("moment");
const nodemailer = require("nodemailer");
let ret = new response();
const fs = require("fs");
const path = require("path");
const env = require('../config/env')

const transporter = nodemailer.createTransport({
  host: "email-ssl.com.br",
  //host: "smtp.yupa.com.br",
  port: 587,
  secure: false,
  tls: false,
  ignoreTLS: true,
  auth: {
    user: global.userNameSmtp,
    pass: global.passwordSmtp,
  },
  
});

async function Send(name, emailTo, subject, fromName, message) {
  try {
    console.log('Encaminhando email De:',fromName,' para:',name,' Email:',emailTo,'Remetente:',subject);
    
    const info = await transporter.sendMail({
      from: fromName + " <suporte@yupa.com.br>", 
      to: name + ", " + emailTo, 
      subject: subject, 
      html: message
    });
    return info
  } catch (error) {
    console.log('erro enviando email', error);
  }
}

module.exports = {
  Send,
};
