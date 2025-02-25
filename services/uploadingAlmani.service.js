const xls = require('../services/excel.service');
const utils = require('./utils.service')
const { Op, col } = require('sequelize');
const response = require("../models/customresponse");
const moment = require("moment");
const tb_imports = require("../models/tb_imports");
const tb_imports_datas = require("../models/tb_imports_datas");
const tb_imports_datas_erros = require("../models/tb_imports_datas_erros");
const tb_imports_relation_columns = require("../models/tb_imports_relation_columns");
const tb_cars = require("../models/tb_cars");

async function create(dataResponse, create) {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();
    let columnsRelations = await tb_imports_relation_columns.findAll();

    if (!Array.isArray(dataResponse.data)) {
      console.error("Erro: dataResponse não é um array válido.", dataResponse.data);
      throw new Error("dataResponse deve ser um array");
    }

    // Verifica se columnsRelations é um array válido
    if (!Array.isArray(columnsRelations)) {
      console.error("Erro: columnsRelations não é um array válido.", columnsRelations);
      throw new Error("columnsRelations deve ser um array");
    }

    let updatedData = dataResponse.data.map(record => {
      if (typeof record !== "object" || record === null) {
        console.warn("Aviso: Encontrado um registro inválido em dataResponse", record);
        return record; // Pula registros inválidos
      }

      let newRecord = { ...record, }; // Clona o objeto original
      newRecord.impd_status = 1;
      newRecord.imp_id = create.imp_id;

      for (let column of columnsRelations) {
        if (!column || typeof column !== "object") continue;
        let columnToChange = column.impr_column_plan; // Nome antigo
        let newColumn = column.impr_column_db; // Nome novo

        if (!columnToChange || !newColumn) {
          console.warn("Aviso: Coluna com dados inválidos", column);
          continue;
        }

        if (newRecord.hasOwnProperty(columnToChange)) {
          newRecord[newColumn] = newRecord[columnToChange] ?? false;
          delete newRecord[columnToChange]; // Remove a antiga
        }
      }

      return newRecord;
    });
    let destroy = await tb_imports_datas.destroy({
      where: {},
      truncate: true,
    });
    const carsToCreate = [];

    for (const element of updatedData) {
      let car_plate = element.car_plate;
      let isCarFound = await tb_cars.findByPk(car_plate);

      if (!isCarFound) {  // Correção: findByPk retorna null se não encontrar o registro
        carsToCreate.push({
          car_plate: car_plate,
          car_status: 1,
          car_name: "N/A",
          car_model: "N/A",
          car_collor: "N/A",
          car_year: "N/A",
          car_chacci: "N/A",
          car_informations: "N/A"
        });
      }
    }
    if (carsToCreate.length > 0) {
      await tb_cars.bulkCreate(carsToCreate);
    }
    if (updatedData.length > 0) {
      await tb_imports_datas.bulkCreate(updatedData);
    } else {
      console.warn("Nenhum dado válido encontrado para inserção.");
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


module.exports = {
  create,
};
