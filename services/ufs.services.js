const tb_table = require("../models/tb_ufs")// informar a tabela template que deseja acessar
const response = require("../models/customresponse");
const moment = require("moment");

async function read() {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let read = await tb_table.findAll({})// inserir informações adicionais como ordenação etc
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

async function readOne(ID) {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let read = []
    let result = await tb_table.findByPk(ID);
    read.push(result);
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
    let registerToUpdate = await tb_table.findByPk(registerDataToUpdate.uf_id)//Informar o ID do registro que será atualizado
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
    
    let registerToCreate = obj;
    let create = [];
    let registerCreated = await tb_table.create(registerToCreate);
    create.push(registerCreated);

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

async function destroy(id) {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeSentFromClient = obj.timeSentFromClient;
    this.ret.timeReceivedFromBack = moment().valueOf();
   
    let registerToDestroy = id
    let destroy = await tb_table.destroy({
      where: {id}, // informar o id da tabela para o delete
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
  update,
  readOne
};
