const xlsx = require('xlsx');
const response = require("../models/customresponse");
const moment = require("moment");

// Função para ler a planilha e converter em um array de objetos
async function readExcelFile(string, type) {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];

  try {
    let buffer
    let workbook
    let sheetName
    let worksheet
    let data
    if (type == 0) {
      buffer = Buffer.from(string, 'base64');
      workbook = xlsx.read(buffer, { type: 'buffer' });
      sheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[sheetName];
      data = xlsx.utils.sheet_to_json(worksheet);
    }
    if(type == 1){
      workbook = xlsx.readFile(string);
      sheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[sheetName];
      data = xlsx.utils.sheet_to_json(worksheet);
    }   

    ret.data = data;
    ret.timeSentFromBack = moment().valueOf();
    ret.httpStatus = 200;
  } catch (error) {
    ret.errorCount = 1;
    ret.data = [];
    ret.httpStatus = 401;
    ret.errors.push(error.message);
    ret.timeSentFromBack = moment().valueOf();
  }
  return ret;
}

module.exports = {
  readExcelFile,
};