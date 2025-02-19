const tb_table = require("../models/tb_filters")
const { Op } = require('sequelize');
const response = require("../models/customresponse");
const moment = require("moment");

async function read() {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
     let read = await tb_table.findAll({
      order: [
        ['flt_name', 'ASC'] // Ordena pela coluna 'id' em ordem ascendente
      ]
    })
    
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

async function update(obj) {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let registerDataToUpdate = obj
    let registerToUpdate = await tb_table.findByPk(registerDataToUpdate.cc_id)
    if (registerToUpdate) {
      Object.keys(registerDataToUpdate).forEach(key => {
        registerToUpdate[key] = registerDataToUpdate[key];
      });
      let update = await registerToUpdate.save();

      this.ret.data = { update };
      this.ret.timeSentFromBack = moment().valueOf();
      this.ret.httpStatus = 200;
    } else {
      this.ret.errorCount = 1;
      this.ret.data = {};
      this.ret.httpStatus = 401;
      this.ret.errors.push('ID não localizado para o Update');
      this.ret.timeSentFromBack = moment().valueOf();
    }
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
    let registerToCreate = obj
   
    let create = await tb_table.create(registerToCreate)

    this.ret.data = { create };
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
    let registerToDestroy = obj
    let destroy = await tb_table.destroy({
      where: { cc_id: registerToDestroy },
      returning: true,
      plain: true,
    });
    this.ret.data = { destroy };
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
  update
};
