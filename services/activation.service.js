const sequelize = require("../config/database");
const tb_users = require("../models/tb_users")
const response = require("../models/customresponse");
const moment = require("moment");
let ret = new response();
const { v4: uuidv4 } = require("uuid");
async function Activation(activationCode) {
  let ret;
  try {
    let existAccount = await tb_users.findOne({
      usr_activationcode: activationCode,
    });
    if (existAccount.dataValues) {
      existAccount.dataValues.usr_activated = true;
      const pk = existAccount.dataValues.usr_id;
      delete existAccount.dataValues.usr_id;
      ret = await tb_users.update(existAccount.dataValues, {
        where: { usr_id: pk },
        returning: true,
        plain: true,
      });
    }
    if(ret.length > 0)
    {
      return true
    }
    else
    {
      return false
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  Activation,
};
