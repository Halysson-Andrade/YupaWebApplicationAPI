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
const tb_ufs = require("../models/tb_ufs");

async function create(dataResponse, create) {
  try {
    this.ret = new response();
    this.ret.errorCount = 0;
    this.ret.errors = [];
    this.ret.timeReceivedFromBack = moment().valueOf();

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    let columnsRelations = await tb_imports_relation_columns.findAll();
    let registersToImport = dataResponse.data;
    let dataToInsert = [];
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    if (!Array.isArray(dataResponse.data)) {
      console.error("Erro: dataResponse não é um array válido.", dataResponse.data);
      throw new Error("dataResponse deve ser um array");
    }
    if (!Array.isArray(columnsRelations)) {
      console.error("Erro: columnsRelations não é um array válido.", columnsRelations);
      throw new Error("columnsRelations deve ser um array");
    }
    for (const element of registersToImport) {
      const isPlateFound = await tb_imports_datas.findOne({
        where: {
          car_plate: element.Placa
        }
      });

      if (isPlateFound) {
        console.log("Realizar update do registro!");
        let newRecord = { ...element };
        let columnsToUpdate = await tb_imports_relation_columns.findAll();
        for (const element of columnsToUpdate) {
          const columnName = element.impr_column_plan;
          const value = newRecord[columnName];
        
          if (value) {
            isPlateFound[element.impr_column_db] = value;
            isPlateFound.impd_status = 1;
            await isPlateFound.save(); 
          } else {
            // Se quiser, trate o "else" aqui
          }
        }
        
      } else {
        let newRecord = { ...element };
        const ufData = await tb_ufs.findOne({
          where: {
            uf_code: element.UF
          }
        });

        if (ufData && ufData.uf_days) {
          let futureDate = new Date();
          newRecord.impd_status = 2;
          newRecord.imp_id = create.imp_id;
          newRecord.impd_start_date = formatDate(today);
          futureDate.setDate(today.getDate() + ufData.uf_days);
          newRecord.impd_target_date = formatDate(futureDate);
          newRecord.car_plate = newRecord.Placa;
          newRecord.impd_uf_transfer = newRecord.UF;
          newRecord.impd_lote = newRecord.Lote;
          newRecord.impd_complete_kit = false;
          newRecord.impd_restrition = false;
          newRecord.impd_debit = false;
          newRecord.impd_sale_com = false;
          newRecord.impd_vistory_complete = false;
          newRecord.impd_saler_pending = false;
          newRecord.impd_crlv_avaible = false;
          newRecord.impd_plate_change = false;
          newRecord.impd_fineshed = false;
          dataToInsert.push(newRecord);
        } else {
          console.log("Não existe UF cadastrada!")
        }
      }
    }
    const carsToCreate = [];
    for (const element of dataToInsert) {
      let car_plate = element.car_plate;
      let isCarFound = await tb_cars.findByPk(car_plate);

      if (!isCarFound) {
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
    if (dataToInsert.length > 0) {
      await tb_imports_datas.bulkCreate(dataToInsert);
    } else {
      console.warn("Nenhum dado válido encontrado para inserção.");
    }

    this.ret.data = { result: true };
    this.ret.timeSentFromBack = moment().valueOf();
    this.ret.httpStatus = 200;
  } catch (error) {
    if (error.original.detail){
      this.ret.errors.push(error.original.detail);
    }else{
      this.ret.errors.push(error.message);
    }
    this.ret.errorCount = 1;
    this.ret.data = {};
    this.ret.httpStatus = 401;
   
    this.ret.timeSentFromBack = moment().valueOf();
  }
  return this.ret;
}


module.exports = {
  create,
};
