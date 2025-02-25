const xlsx = require('xlsx');
const response = require("../models/customresponse");
const moment = require("moment");

// Função para converter o número serial do Excel em data legível
function excelSerialToDate(serial) {
  const excelBaseDate = new Date(1900, 0, 1);
  return new Date(excelBaseDate.getTime() + (serial - 1) * 24 * 60 * 60 * 1000);
}

// Função para ler a planilha e converter em um array de objetos
async function readExcelFile(string, type) {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];

  try {
    let buffer, workbook, sheetName, worksheet, data;

    if (type == 0) {
      buffer = Buffer.from(string, 'base64');
      workbook = xlsx.read(buffer, { type: 'buffer' });
    } else if (type == 1) {
      workbook = xlsx.readFile(string);
    }

    sheetName = workbook.SheetNames[0];
    worksheet = workbook.Sheets[sheetName];
    data = xlsx.utils.sheet_to_json(worksheet);

    // Converter campos de data serial
    data = data.map((item) => {
      Object.keys(item).forEach((key) => {
        if (!isNaN(item[key]) && parseInt(item[key]) > 40000 && parseInt(item[key]) < 80000) {
          item[key] = moment(excelSerialToDate(item[key])).format("YYYY-MM-DD");
        }
      });
      return item;
    });

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
