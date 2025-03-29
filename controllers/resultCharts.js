const response = require("../models/customresponse");
const loadingCharts = require("../services/loadingCharts.services");
const { Op, Sequelize } = require('sequelize');
const moment = require("moment");
function convertDateToShortYear(dateStr) {
  // Verifica se a data está no formato yyyy-mm-dd
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = dateStr.match(regex);

  if (match) {
    const year = match[1];
    const month = match[2];
    const day = match[3];

    // Extrai os dois últimos dígitos do ano
    const shortYear = year.slice(-2);

    // Retorna a data no formato dd/mm/yy
    return `${day}/${month}/${shortYear}`;
  } else {
    throw new Error('Formato de data inválido. Use yyyy-mm-dd.');
  }
}


exports.index = async (req, res) => {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];
  ret.timeReceivedFromBack = moment().valueOf();
  try {
    ret.timeSentFromClient = req.body.timeSentFromClient;
    ret.timeReceivedFromBack = moment().valueOf();
    
    // Capturando parâmetros da requisição
    let startDate = req.query.startDate;
    startDate = startDate.substring(0, 10);
    let endDate = req.query.endDate;
    endDate = endDate.substring(0, 10);
    let start = new Date(startDate);
    let end = new Date(endDate);
    let diffInMilliseconds = end - start;
    let countDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    countDays = countDays + 1
    const filterSent = req.body.arrayData
    if(startDate == ''){
      startDate ='01/01/2025'
      endDate ='01/01/2029'
    }
    const [
      //result,
      //days,
      barResult,
      //BossResult,
      //petrolChart,
      //petrolBossChart,
      //timeTsk,
      //CurveTsk,
      Curveprot] = await Promise.all([
        //loadingCharts.loadingSumaryChartPie(),
        //loadingCharts.loadingDaysChartPie(),
        loadingCharts.loadingResultsChartBar(startDate,endDate),
        //loadingCharts.loadingResultsChartBoss(),
        //loadingCharts.loadingPetrolsChartPie(),
        //loadingCharts.loadingPetrolChartBoss(),
        //loadingCharts.loadingResultsTimeLine(),
        //loadingCharts.loadingResultsTskLine(),
        //loadingCharts.loadingResultsProtLine(),
      ]);
    //Charts//
    let bar = barResult.data.chart
    let kanban = barResult.data.kanban
    let techniciansData = []

    //Details//
    /*let techniciansData = result.data.data
    days.data.data.forEach(dataToInsert => {
      techniciansData.push(dataToInsert)
    });
    timeTsk.data.data.forEach(dataToInsert => {
      techniciansData.push(dataToInsert)
    });
    Curveprot.data.data.forEach(dataToInsert => {
      techniciansData.push(dataToInsert)
    });
    petrolChart.data.data.forEach(dataToInsert => {
      techniciansData.push(dataToInsert)
    });
    petrolBossChart.data.data.forEach(dataToInsert => {
      techniciansData.push(dataToInsert)
    });*/
    barResult.data.data.forEach(dataToInsert => {
      techniciansData.push(dataToInsert)
    });
    /*BossResult.data.data.forEach(dataToInsert => {
      techniciansData.push(dataToInsert)
    });*/
  
   
    ret.data = { EChartsData: { techniciansData }, EChartsOption: { bar }, EChartskanban:{kanban} };
    ret.httpStatus = 200;
  } catch (error) {
    ret.data = {};
    ret.errors.push(error.message);
    ret.errorCount = ret.errors.length;
    ret.httpStatus = 400;
  }

  return res.status(ret.httpStatus).json(ret);
};