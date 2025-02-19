const response = require("../models/customresponse");
const dataTemplate = require("../services/dataTemplate")
const moment = require("moment");
// Função para contar os registros correspondentes por ID
function contarDetalhesPorID(array, xAxis) {
  let contagem = new Array(xAxis.length).fill(0); // Inicializa array com 0s para todos os IDs
  array.forEach(item => {
    let id = item.name.substring(0, 2); // Captura os 2 primeiros caracteres
    let index = xAxis.indexOf(id); // Localiza o índice do ID no eixo X
    if (index !== -1 && item.details) { // Se o ID existir em xAxis e 'details' estiver definido
      let count = item.details.length;
      let itensDetails = item.details
      let days = []
      itensDetails.forEach(element => {
        let dayFound = days.indexOf(element.toa_rs_ticket_date)
        if(dayFound == -1 && element.toa_rs_ticket_date){
          days.push(element.toa_rs_ticket_date)
        }
      });
      count = count /days.length;
      contagem[index] += count.toFixed(0); // Adiciona o total de registros em 'details' para o ID correspondente
    }
  });
  return contagem;
}

function contarDetalhesPorIDProt(array, xAxis) {
  let contagem = new Array(xAxis.length).fill(0); // Inicializa array com 0s para todos os IDs
  array.forEach(item => {
    let id = item.name.substring(0, 2); // Captura os 2 primeiros caracteres
    let index = xAxis.indexOf(id); // Localiza o índice do ID no eixo X
    if (index !== -1 && item.details) { // Se o ID existir em xAxis e 'details' estiver definido
      let count = item.details.length;
      let itensDetails = item.details
      let days = []
      itensDetails.forEach(element => {
        let dayFound = days.indexOf(element.pth_rs_data)
        if(dayFound == -1 && element.pth_rs_data){
          days.push(element.pth_rs_data)
        }
      });
      count = count /days.length;
      contagem[index] += count.toFixed(0); // Adiciona o total de registros em 'details' para o ID correspondente
    }
  });
  return contagem;
}
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

function convertTimeToDecimal(time) {
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    return 0;
  }
  return hours + minutes / 60;
}

function classificTime(time) {
  let classification = ''
  if (time <= 0.10) {
    classification = '10 min'
  }
  if (time > 0.10 && time <= 0.30) {
    classification = '30 min'
  }
  if (time > 0.30 && time <= 1) {
    classification = '1h'
  }
  if (time > 1 && time <= 2) {
    classification = '2h'
  }
  if (time > 2 && time <= 3) {
    classification = '3h'
  }
  if (time > 3 && time <= 4) {
    classification = '4h'
  }
  if (time > 4 && time <= 5) {
    classification = '5h'
  }
  if (time > 5 && time <= 6) {
    classification = '6h'
  }
  if (time > 6 && time <= 7) {
    classification = '7h'
  }
  if (time > 7 && time <= 8) {
    classification = '8h'
  }
  if (time > 8) {
    classification = '>8h'
  }
  return classification
}

async function loadingSumaryChartPie(obj, objNoFoun) {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];
  ret.timeReceivedFromBack = moment().valueOf();
  try {
    //Detalhes do Grafico
    let technicians = obj
    let t = [];
    // Busca e processamento dos registros
    let noFound = objNoFoun

    const pattern = /TLP-T(\d+)/;
    noFound.forEach(tech => {
      const description = tech.dataValues.toa_rs_provider;
      const match = description.match(pattern);
      if (match) {
        const extractedField = match[0];
        const cleanField = extractedField.replace('TLP-', '');
        t.push({ ...tech.dataValues, cleanField });
      }
    });

    const technicianIds = new Set(technicians.map(tech => tech.pth_rs_matricula_tim));
    const notInTechnicians = t.filter(record => !technicianIds.has(record.cleanField));

    const countTechnicianIds = technicianIds.size;
    const countNotInTechnicians = notInTechnicians.length;

    let uniqueTechnicians = technicians.reduce((acc, technician) => {
      const key = `${technician.pth_rs_filial}-${technician.pth_rs_matricula}-${technician.pth_rs_nome}-${technician.pth_rs_cc}-${technician.pth_rs_funcao}`;
      if (!acc[key]) {
        acc[key] = {
          filial: technician.pth_rs_filial,
          matricula: technician.pth_rs_matricula,
          matricula_tim: technician.pth_rs_matricula_tim,
          nome: technician.pth_rs_nome,
          centro_custo: technician.pth_rs_cc,
          funcao: technician.pth_rs_funcao,
          centro_custo: technician.pth_rs_cc,
        };
      }
      return acc;
    }, {});
    let techniciansArray = Object.values(uniqueTechnicians); // Técnicos localizados.

    let data = [
      {
        name: 'localizados',
        details: techniciansArray
      },
      {
        name: 'Não localizados',
        details: notInTechnicians
      }
    ];

    let pie = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Total técnicos', 'Localizados', 'Não localizados'],
      },
      series: [
        {
          name: 'Distribuição',
          type: 'pie',
          data: [
            { value: 100, name: 'Total técnicos', itemStyle: { color: '#42f566' } },
            { value: 60, name: 'Localizados', itemStyle: { color: '#f5d142' } },
            { value: 40, name: 'Não localizados', itemStyle: { color: '#f55142' } }
          ],
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {c}',
            fontSize: 18
          },
        }
      ]
    };
    

    let read = {}
    read.data = data
    read.chart = pie
    read.acrossResult = technicians

    ret.data = read;
    ret.httpStatus = 200;
  } catch (error) {
    ret.data = {};
    ret.errors.push(error.message);
    ret.errorCount = ret.errors.length;
    ret.httpStatus = 400;
  }
  return ret;
}

async function loadingDaysChartPie(obj, countDays) {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];
  ret.timeReceivedFromBack = moment().valueOf();
  try {
    //Detalhes do Grafico
    let acrossResult = []
    obj.forEach(item => {
      acrossResult.push(item.dataValues)
    });

    let acrossResultError = []
    let acrossResultNoMark = []
    let acrossResultNoMarkNoProd = []
    let acrossResultImpar = []
    let acrossResultNoLanche = []

    obj.forEach(item => {
      //marc impar
      if (
        (item.dataValues.pth_rs_hora != 'N/A' && item.dataValues.pth_rs_hora2 == 'N/A') ||
        (item.dataValues.pth_rs_hora3 != 'N/A' && item.dataValues.pth_rs_hora4 == 'N/A') ||
        (item.dataValues.pth_rs_hora5 != 'N/A' && item.dataValues.pth_rs_hora6 == 'N/A') ||
        (item.dataValues.pth_rs_hora7 != 'N/A' && item.dataValues.pth_rs_hora8 == 'N/A')
      ) {
        acrossResultImpar.push(item.dataValues)
      }
      if (
        (item.dataValues.pth_rs_hora2 != 'N/A' && item.dataValues.pth_rs_hora3 == 'N/A')
      ) {
        acrossResultNoLanche.push(item.dataValues)
      }
      if (
        (
          item.dataValues.pth_rs_hora == 'N/A' &&
          item.dataValues.pth_rs_hora2 == 'N/A' &&
          item.dataValues.pth_rs_hora3 == 'N/A' &&
          item.dataValues.pth_rs_hora4 == 'N/A' &&
          item.dataValues.pth_rs_hora5 == 'N/A' &&
          item.dataValues.pth_rs_hora6 == 'N/A' &&
          item.dataValues.pth_rs_hora7 == 'N/A' &&
          item.dataValues.pth_rs_hora8 == 'N/A'
        )
      ) {
        const durationInDecimal = convertTimeToDecimal(item.dataValues.toa_rs_duration);
        if (durationInDecimal > 0) {
          acrossResultNoMark.push(item.dataValues)
        } else {
          acrossResultNoMarkNoProd.push(item.dataValues)
        }
      }

      /*if (item.dataValues.pth_rs_hora4 == 'N/A') {
        acrossResultError.push(item.dataValues)
      }*/
    });


    const countAcrossResult = Object.keys(obj).length;
    //let countAcrossResultError = Object.keys(acrossResultError).length;
    let countAcrossResultNoMark = Object.keys(acrossResultNoMark).length;
    let countAcrossResultNoMarkNoProd = Object.keys(acrossResultNoMarkNoProd).length;
    let countAcrossResultImpar = Object.keys(acrossResultImpar).length;
    let countAcrossResultNoLanche = Object.keys(acrossResultNoLanche).length;
    let data = [
      {
        name: 'Técnicos totais Analisados',
        details: []
      },
      /*{
        name: 'Erro de ponto',
        details: []
      },*/
      {
        name: 'Marcações impar',
        details: []
      },
      {
        name: 'Técnicos sem marcação e sem produção',
        details: []
      },
      {
        name: 'Técnicos sem marcação e com produção',
        details: []
      },
      {
        name: 'Sem almoço',
        details: []
      },
    ];
    let dayText = countDays === 1 ? `${countDays} Dia` : `${countDays} Dias`;
    let chart = {
      tooltip: {
        trigger: 'item', // Aciona o tooltip ao passar sobre um item
        formatter: '{b}: {c} ({d}%)', // Formatação do texto do tooltip: Nome, valor e porcentagem
      },
      legend: {
        orient: 'vertical', // Orientação vertical
        left: 'left',      // Alinhamento à esquerda
        textStyle: {
          color: '#000', // Cor do texto da legenda
        }
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '70%'], // Ajusta o tamanho da pizza e o tamanho do centro
          data: [
            { value: countAcrossResult, name: 'Técnicos totais Analisados', itemStyle: { color: '#42f566' } },
            //{ value: countAcrossResultError, name: 'Erro de ponto', itemStyle: { color: '#f55142' } },
            { value: countAcrossResultImpar, name: 'Marcações impar', itemStyle: { color: '#34d5eb' } },
            { value: countAcrossResultNoMarkNoProd, name: 'Técnicos sem marcação e sem produção', itemStyle: { color: '#ebb734' } },
            { value: countAcrossResultNoMark, name: 'Técnicos sem marcação e com produção', itemStyle: { color: '#de34eb' } },
            { value: countAcrossResultNoLanche, name: 'Sem almoço', itemStyle: { color: '#e2eb34' } },
          ],
          label: {
            show: false, // Oculta os rótulos das fatias
            position: 'outside', // Posiciona as etiquetas fora do gráfico
            formatter: '{b}: {c}', // Formata o texto da etiqueta
            textStyle: {
              color: '#000', // Cor do texto da etiqueta
              fontSize: 18   // Tamanho da fonte
            }
          },
          labelLine: {
            show: true, // Mostra as linhas de rótulo
            length: 15, // Comprimento das linhas de rótulo
            length2: 10 // Comprimento das linhas de rótulo fora do gráfico
          }
        }
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: dayText, // Valor total no centro
            textAlign: 'center',
            fontSize: 24, // Ajuste o tamanho da fonte conforme necessário
            fontWeight: 'bold',
            fill: '#333' // Cor do texto
          }
        }
      ]
    };

    let read = {}
    const acrossToInsertBank = Object.keys(acrossResult);
    for (const key of acrossToInsertBank) {
      let dataToInsert = acrossResult[key]
      data[0].details.push(dataToInsert)

    }

    /* const acrossToInsertErrorBank = Object.keys(acrossResultError);
     for (const key of acrossToInsertErrorBank) {     
         let dataToInsert = acrossResultError[key]
         data[1].details.push(dataToInsert)
     }*/

    const acrossToInsertErrorImpar = Object.keys(acrossResultImpar);
    for (const key of acrossToInsertErrorImpar) {
      let dataToInsert = acrossResultImpar[key]
      data[1].details.push(dataToInsert)
    }

    const acrossToInsertErrorNoMarkNoProd = Object.keys(acrossResultNoMarkNoProd);
    for (const key of acrossToInsertErrorNoMarkNoProd) {
      let dataToInsert = acrossResultNoMarkNoProd[key]
      data[2].details.push(dataToInsert)
    }
    const acrossToInsertErrorNoMarkBank = Object.keys(acrossResultNoMark);
    for (const key of acrossToInsertErrorNoMarkBank) {
      let dataToInsert = acrossResultNoMark[key]
      data[3].details.push(dataToInsert)
    }

    const acrossToInsertErrorNoLanche = Object.keys(acrossResultNoLanche);
    for (const key of acrossToInsertErrorNoLanche) {
      let dataToInsert = acrossResultNoLanche[key]
      data[4].details.push(dataToInsert)
    }

    read.data = data
    read.chart = chart

    ret.data = read;
    ret.httpStatus = 200;
  } catch (error) {
    ret.data = {};
    ret.errors.push(error.message);
    ret.errorCount = ret.errors.length;
    ret.httpStatus = 400;
  }
  return ret;
}

async function loadingPetrolsChartPie(obj) {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];
  ret.timeReceivedFromBack = moment().valueOf();
  try {

    let resultTotalValueKm = {
      value: 0,
      km: 0
    };
    let valueDetail = [];
    const petrolTotalValue = obj.reduce((accumulator, currentObject) => {
      const value = currentObject.pth_rs_petrol_value;
      if (value !== 0) {
        const km = currentObject.pth_rs_petrol_km;
        const filteredItem = {
          filial: currentObject.pth_rs_filial,
          matricula: currentObject.pth_rs_matricula,
          nome: currentObject.pth_rs_nome,
          cc: currentObject.pth_rs_cc,
          value: currentObject.pth_rs_petrol_value,
          km: currentObject.pth_rs_petrol_km,
        }
        valueDetail.push(filteredItem);
        return {
          value: accumulator.value + value,
          km: accumulator.km + km
        };
      } else {
        return accumulator; // Retorna o acumulador sem modificações
      }
    }, resultTotalValueKm);

    let data = [
      {
        name: 'Custo',
        details: []
      }
    ];

    let chart = {
      legend: {
        orient: 'vertical', // Orientação vertical
        left: 'left',      // Alinhamento à esquerda
        data: [
          'Custo'
        ], // Dados que devem aparecer na legenda
        textStyle: {
          color: '#000', // Cor do texto da legenda
        }
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '70%'], // Ajusta o tamanho da pizza e o tamanho do centro
          data: [
            { value: petrolTotalValue.value.toFixed(2), name: 'Custo', itemStyle: { color: '#42f566' } },
            //{ value: petrolTotalValue.km.toFixed(2), name: 'KM Rodados', itemStyle: { color: '#f55142' } },
          ],
          label: {
            show: true, // Mostra os rótulos das fatias
            position: 'outside', // Posiciona as etiquetas fora do gráfico
            formatter: '{b}: {c}', // Formata o texto da etiqueta
            textStyle: {
              color: '#000', // Cor do texto da etiqueta
              fontSize: 18   // Tamanho da fonte
            }
          },
          labelLine: {
            show: true, // Mostra as linhas de rótulo
            length: 15, // Comprimento das linhas de rótulo
            length2: 10 // Comprimento das linhas de rótulo fora do gráfico
          }
        }
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(petrolTotalValue.value.toFixed(2))}`,
            textAlign: 'center',
            fontSize: 24, // Ajuste o tamanho da fonte
            fontWeight: 'bold',
            fill: '#333' // Cor do texto
          }
        }
      ]
    };

    let read = {}
    const acrossToInsertBank = Object.keys(valueDetail);
    for (const key of acrossToInsertBank) {
      if (key == 0) { } else {
        let dataToInsert = valueDetail[key]
        data[0].details.push(dataToInsert)
      }
    }

    read.data = data
    read.chart = chart

    ret.data = read;
    ret.httpStatus = 200;
  } catch (error) {
    ret.data = {};
    ret.errors.push(error.message);
    ret.errorCount = ret.errors.length;
    ret.httpStatus = 400;
  }
  return ret;
}

async function loadingResultsChartBar() {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];
  ret.timeReceivedFromBack = moment().valueOf();
  try {
    let data = [
      {
        name: '01/02/2024',
        details: [{nome:'Halysson', idade: 12}]
      },
      {
        name: '02/02/2024',
        details: [{nome:'Halysson', idade: 12}]
      },
      {
        name: '03/02/2024',
        details: [{nome:'Halysson', idade: 12}]
      },
    ];

    let bar = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: ['01/02/2024', '02/02/2024', '03/02/2024'],
          axisLabel: {
            rotate: 0,
            interval: 0
          }
        },
      ],
      yAxis: [
        {
          type: 'value'
        },
      ],
      series: [
        {
          name: '',
          type: 'bar',
          data: [
            { value: 10, itemStyle: { color: '#3285a8' } },
            { value: 20, itemStyle: { color: '#f5d142' } },
            { value: 30, itemStyle: { color: '#f55142' } }
          ],
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            fontSize: 18
          }
        },
      ]
    }
    let read = {}
    read.chart = bar
    read.data = data
    ret.data = read;
    ret.httpStatus = 200;
  } catch (error) {
    ret.data = {};
    ret.errors.push(error.message);
    ret.errorCount = ret.errors.length;
    ret.httpStatus = 400;
  }
  return ret;
}

async function loadingResultsChartBoss(obj) {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];
  ret.timeReceivedFromBack = moment().valueOf();
  try {

    let result = {}
    result.data = []
    result.chart = {}

    // Indexando obj
    let bossResult = obj;
    let corNames = []
    let hhProt = []
    let hhToa = []
    let hhNo = []
    const bossResultMap = new Map();
    bossResult.forEach(boss => {
      const key = `${boss.pth_rs_coordenador}`;
      if (!bossResultMap.has(key)) {
        bossResultMap.set(key, []);
        corNames.push(key)
      }
      bossResultMap.get(key).push(boss);
    });

    let totalResul = {
      hhToa: 0,
      hhProt: 0,
      hhAloc: 0
    }
    let bossTamplate = {
      chartData: [],
      detailData: []
    }
    bossResultMap.forEach(element => {
      let coordName = element[0].pth_rs_coordenador
      element.detail = [
        {
          name: `${coordName}_HH_Folha`,
          details: []
        },
        {
          name: `${coordName}_HH_TOA`,
          details: []
        },
        {
          name: `${coordName}_HH_NO`,
          details: []
        }
      ]
      const resultBoss = element.reduce((accumulator, currentObject) => {
        if (currentObject.pth_rs_hora4 != 'N/A') {
          const durationInDecimal = convertTimeToDecimal(currentObject.toa_rs_duration);
          const hhFolhaSum = currentObject.pth_rs_he + currentObject.pth_rs_hee + currentObject.pth_rs_bc + currentObject.pth_rs_bcc + currentObject.pth_rs_hh + currentObject.pth_rs_al
          let noOcupation = 0
          if (hhFolhaSum > durationInDecimal) {
            element.detail[2].details.push(currentObject.dataValues)
            noOcupation = hhFolhaSum - durationInDecimal
          }
          currentObject.dataValues.hhFolhaSum = hhFolhaSum
          currentObject.dataValues.durationInDecimal = durationInDecimal
          currentObject.dataValues.noOcupation = noOcupation

          if (hhFolhaSum > 0) {
            element.detail[0].details.push(currentObject.dataValues)
          }
          if (durationInDecimal > 0) {
            element.detail[1].details.push(currentObject.dataValues)
          }
          return {
            hhProt: accumulator.hhProt + hhFolhaSum,
            hhToa: accumulator.hhToa + durationInDecimal,
            hhAloc: accumulator.hhAloc + noOcupation
          }
        } else {
          return accumulator;
        }
      }, totalResul);

      let detailDataResult = {
        name: '',
        details: []
      }

      bossTamplate.detailData.push(element.detail)
      hhProt.push(resultBoss.hhProt.toFixed(2));
      hhToa.push(resultBoss.hhToa.toFixed(2));
      hhNo.push(resultBoss.hhAloc.toFixed(2));
    });

    let data = []
    bossTamplate.detailData.forEach(dataDetail => {
      dataDetail.forEach(element => {
        data.push(element)
      });
    });

    let bar = {
      color: ['#3398DB', '#f39c12', '#e74c3c'], // Cores para as três séries
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow', // Mostra a sombra ao passar o mouse nas colunas
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: corNames, // Eixo X com os meses
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: '#333', // Cor da linha do eixo X
          },
        }, axisLabel: {
          show: false, // Esconde os rótulos do eixo X
        }
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'HH_Folha',
          type: 'bar',
          stack: 'total', // Empilha as barras na mesma coluna
          data: hhProt, // Dados para cada mês
          label: {
            show: false,
            position: 'inside', // Exibe os valores dentro das barras
          },
        },
        {
          name: 'HH_TOA',
          type: 'bar',
          stack: 'total', // Empilha as barras na mesma coluna
          data: hhToa, // Dados para cada mês
          label: {
            show: false,
            position: 'inside', // Exibe os valores dentro das barras
          },
        },
        {
          name: 'HH_NO',
          type: 'bar',
          stack: 'total', // Empilha as barras na mesma coluna
          data: hhNo, // Dados para cada mês
          label: {
            show: false,
            position: 'inside', // Exibe os valores dentro das barras
          },
        },
      ],
    };

    let read = {}
    read.chart = bar
    read.data = data
    ret.data = read;
    ret.httpStatus = 200;
  } catch (error) {
    ret.data = {};
    ret.errors.push(error.message);
    ret.errorCount = ret.errors.length;
    ret.httpStatus = 400;
  }
  return ret;
}

async function loadingPetrolChartBoss(obj) {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];
  ret.timeReceivedFromBack = moment().valueOf();
  try {

    let result = {}
    result.data = []
    result.chart = {}

    // Indexando obj
    let bossResult = obj;
    let corNames = []
    let hhpetrol = []
    let total = []

    const bossResultMap = new Map();
    bossResult.forEach(boss => {
      const key = `${boss.pth_rs_coordenador}`;
      if (!bossResultMap.has(key)) {
        bossResultMap.set(key, []);
        corNames.push(key)
      }
      bossResultMap.get(key).push(boss);
    });

    let totalResul = {
      hhpetrol: 0,
      total: 0,
    }
    let bossTamplate = {
      chartData: [],
      detailData: []
    }

    bossResultMap.forEach(element => {
      let coordName = element[0].pth_rs_coordenador
      element.detail = [
        {
          name: `${coordName}_Petrol`,
          details: []
        },
      ]

      const resultBoss = element.reduce((accumulator, currentObject) => {
        if (currentObject.pth_rs_matricula_tim != 'N/A') {
          const petrolValue = currentObject.pth_rs_petrol_value
          let total = 0
          if (petrolValue > 0) {
            element.detail[0].details.push(currentObject.dataValues)
            total = 1
          }

          return {
            hhpetrol: accumulator.hhpetrol + petrolValue,
            total: accumulator.total + total
          }
        } else {
          return accumulator;
        }
      }, totalResul);

      bossTamplate.detailData.push(element.detail)
      hhpetrol.push(resultBoss.hhpetrol.toFixed(2));
      total.push(resultBoss.total.toFixed(2));
    });

    let data = []
    bossTamplate.detailData.forEach(dataDetail => {
      dataDetail.forEach(element => {
        data.push(element)
      });
    });

    let bar = {
      color: ['#fcb438', '#3efc38'], // Cores para as três séries
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow', // Mostra a sombra ao passar o mouse nas colunas
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: corNames, // Eixo X com os meses
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: '#333', // Cor da linha do eixo X
          },
        }, axisLabel: {
          show: false, // Esconde os rótulos do eixo X
        }
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Petrol',
          type: 'bar',
          stack: 'total', // Empilha as barras na mesma coluna
          data: hhpetrol, // Dados para cada mês
          label: {
            show: false,
            position: 'inside', // Exibe os valores dentro das barras
          },
        },
        {
          name: 'total',
          type: 'bar',
          stack: 'total', // Empilha as barras na mesma coluna
          data: total, // Dados para cada mês
          label: {
            show: false,
            position: 'inside', // Exibe os valores dentro das barras
          },
        },
      ],
    };

    let read = {}
    read.chart = bar
    read.data = data
    ret.data = read;
    ret.httpStatus = 200;
  } catch (error) {
    ret.data = {};
    ret.errors.push(error.message);
    ret.errorCount = ret.errors.length;
    ret.httpStatus = 400;
  }
  return ret;
}

async function loadingResultsTimeLine(obj) {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];
  ret.timeReceivedFromBack = moment().valueOf();
  try {
    let registersToMake = obj
    let template = await dataTemplate.dataTimeLineTemplate()
    let data = []
    template.forEach(element => {
      data.push(element)
    });
    registersToMake.forEach(element => {
      const durationInDecimal = convertTimeToDecimal(element.dataValues.toa_rs_duration);
      if (durationInDecimal > 0) {
        let noFound = 0
        if (element.dataValues.toa_rs_sla == 'P1') {
          noFound = 1
          let c = classificTime(durationInDecimal)
          let itemDetail = `${c}_P1`
          let key = data.findIndex(x => x.name == itemDetail)
          data[key].details.push(element.dataValues);
        }
        if (element.dataValues.toa_rs_sla == 'P2') {
          noFound = 1
          let c = classificTime(durationInDecimal)
          let itemDetail = `${c}_P2`
          let key = data.findIndex(x => x.name == itemDetail)
          data[key].details.push(element.dataValues);
        }
        if (element.dataValues.toa_rs_sla == 'P3') {
          noFound = 1
          let c = classificTime(durationInDecimal)
          let itemDetail = `${c}_P3`
          let key = data.findIndex(x => x.name == itemDetail)
          data[key].details.push(element.dataValues);
        }
        if (element.dataValues.toa_rs_sla == 'P4') {
          noFound = 1
          let c = classificTime(durationInDecimal)
          let itemDetail = `${c}_P4`
          let key = data.findIndex(x => x.name == itemDetail)
          data[key].details.push(element.dataValues);
        }
        if (element.dataValues.toa_rs_sla == 'P5') {
          noFound = 1
          let c = classificTime(durationInDecimal)
          let itemDetail = `${c}_P5`
          let key = data.findIndex(x => x.name == itemDetail)
          data[key].details.push(element.dataValues);
        }
        if (noFound == 0) {
          let c = classificTime(durationInDecimal)
          let itemDetail = `${c}_N/A`
          let key = data.findIndex(x => x.name == itemDetail)
          data[key].details.push(element.dataValues);
        }
      }
    });

    const groups = ['P1', 'P2', 'P3', 'P4', 'P5', 'NA'];

    // Estrutura de dados que define os índices no array `data` para cada contagem em cada grupo
    const dataMapping = {
      P1: { count01: 0, count03: 6, count1: 12, count2: 18, count3: 24, count4: 30, count5: 36, count6: 42, count7: 48, count8: 54, countM8: 60 },
      P2: { count01: 1, count03: 7, count1: 13, count2: 19, count3: 25, count4: 31, count5: 37, count6: 43, count7: 49, count8: 55, countM8: 61 },
      P3: { count01: 2, count03: 8, count1: 14, count2: 20, count3: 26, count4: 32, count5: 38, count6: 44, count7: 50, count8: 56, countM8: 62 },
      P4: { count01: 3, count03: 9, count1: 15, count2: 21, count3: 27, count4: 33, count5: 39, count6: 45, count7: 51, count8: 57, countM8: 63 },
      P5: { count01: 4, count03: 10, count1: 16, count2: 22, count3: 28, count4: 34, count5: 40, count6: 46, count7: 52, count8: 58, countM8: 64 },
      NA: { count01: 5, count03: 11, count1: 17, count2: 23, count3: 29, count4: 35, count5: 41, count6: 47, count7: 53, count8: 59, countM8: 65 }
    };
    const totals = groups.map(group => {
      const counts = dataMapping[group]; // Recupera os índices mapeados para o grupo

      return {
        group,
        count01: data[counts.count01]?.details.length || 0,
        count03: data[counts.count03]?.details.length || 0,
        count1: data[counts.count1]?.details.length || 0,
        count2: data[counts.count2]?.details.length || 0,
        count3: data[counts.count3]?.details.length || 0,
        count4: data[counts.count4]?.details.length || 0,
        count5: data[counts.count5]?.details.length || 0,
        count6: data[counts.count6]?.details.length || 0,
        count7: data[counts.count7]?.details.length || 0,
        count8: data[counts.count8]?.details.length || 0,
        countM8: data[counts.countM8]?.details.length || 0
      };
    });
    let p1 = [];
    let p2 = [];
    let p3 = [];
    let p4 = [];
    let p5 = [];
    let na = [];

    let process = [p1, p2, p3, p4, p5, na]; // Associando os arrays diretamente a um array processado

    // A lista de campos a serem extraídos de cada elemento
    const fields = ['count01', 'count03', 'count1', 'count2', 'count3', 'count4', 'count5', 'count6', 'count7', 'count8', 'countM8'];

    process.push(totals);

    // Itera sobre cada grupo de dados (p1, p2, p3, p4, p5, na)
    totals.forEach((element, index) => {
      fields.forEach(field => {
        process[index].push(element[field]); // Adiciona os valores aos arrays de forma dinâmica
      });
    });



    let bar = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['P1', 'P2', 'P3', 'P4', 'P5', 'N/A']
      },
      xAxis: {
        type: 'category',
        data: ['10 min', '30 min', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '>8h']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'P1',
          type: 'line',
          data: p1
        },
        {
          name: 'P2',
          type: 'line',
          data: p2
        },
        {
          name: 'P3',
          type: 'line',
          data: p3
        },
        {
          name: 'P4',
          type: 'line',
          data: p4
        },
        {
          name: 'P5',
          type: 'line',
          data: p5
        },
        {
          name: 'N/A',
          type: 'line',
          data: na
        },
      ]
    };

    let read = {}
    read.chart = bar
    read.data = data
    ret.data = read;
    ret.httpStatus = 200;
  } catch (error) {
    ret.data = {};
    ret.errors.push(error.message);
    ret.errorCount = ret.errors.length;
    ret.httpStatus = 400;
  }
  return ret;
}

async function loadingResultsProtLine(obj) {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];
  ret.timeReceivedFromBack = moment().valueOf();
  try {
    let registerToCreateChart = obj
    let entrada = []
    let fechamento = []
    registerToCreateChart.forEach(element => {
      if (element.pth_rs_hora4 != "N/A" && element.pth_rs_hora5 == "N/A") {
        if (element.pth_rs_hora != "N/A") {
          let timeOpen = element.pth_rs_hora.substring(0, 2);
          timeOpen = `${timeOpen}_Entradas`
          if (!entrada.some(x => x.name === timeOpen)) {
            let objCreated = {
              name: timeOpen,
              details: [element]
            }
            entrada.push(objCreated);
          } else {
            let key = entrada.findIndex(x => x.name == timeOpen)
            entrada[key].details.push(element)
          }
          //console.log("com registro de entrada")
        } else {
          //console.log("Sem registro de entrada")
        }
        if (element.pth_rs_hora4 != "N/A") {
          let timeClosed = element.pth_rs_hora4.substring(0, 2);
          timeClosed = `${timeClosed}_Saidas`
          if (!fechamento.some(x => x.name === timeClosed)) {
            let objCreated = {
              name: timeClosed,
              details: [element]
            }
            fechamento.push(objCreated);
          } else {
            let key = fechamento.findIndex(x => x.name == timeClosed)
            fechamento[key].details.push(element)
          }
        } else {

        }
      }else{

      }
    });
    entrada.sort((a, b) => {
      if (a.name < b.name) {
        return -1; // a vem antes de b
      }
      if (a.name < b.name) {
        return 1; // a vem depois de b
      }
      return 0; // a e b são iguais
    });

    fechamento.sort((a, b) => {
      if (a.name < b.name) {
        return -1; // a vem antes de b
      }
      if (a.name < b.name) {
        return 1; // a vem depois de b
      }
      return 0; // a e b são iguais
    });

    let xAxis = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    let serieAbertura = [];
    let serieFechamento = [];

    serieAbertura = contarDetalhesPorIDProt(entrada, xAxis);
    serieFechamento = contarDetalhesPorIDProt(fechamento, xAxis);
    let dataUpdate = []
    dataUpdate.push(entrada);
    dataUpdate.push(fechamento)
    let data = [];
    dataUpdate.forEach(element => {
      element.forEach(item => {
        data.push(item)
      });
    });


    let bar = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Entradas', 'Saidas']
      },
      xAxis: {
        type: 'category',
        data: xAxis
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Entradas',
          type: 'line',
          data: serieAbertura,
          itemStyle: {
            color: '#26e314' // Cor personalizada para 'Entradas'
          }
        },
        {
          name: 'Saidas',
          type: 'line',
          data: serieFechamento,
          itemStyle: {
            color: '#f22613' // Cor personalizada para 'Entradas'
          }
        }
      ]
    };

    let read = {}
    read.chart = bar
    read.data = data
    ret.data = read;
    ret.httpStatus = 200;
  } catch (error) {
    ret.data = {};
    ret.errors.push(error.message);
    ret.errorCount = ret.errors.length;
    ret.httpStatus = 400;
  }
  return ret;
}

async function loadingResultsTskLine(obj) {
  const ret = new response();
  ret.errorCount = 0;
  ret.errors = [];
  ret.timeReceivedFromBack = moment().valueOf();
  try {
    let registerToCreateChart = obj
    let entrada = []
    let fechamento = []
    registerToCreateChart.forEach(element => {
      if (element.toa_rs_eta != "") {
        let timeOpen = element.toa_rs_eta.substring(0, 2);
        timeOpen = `${timeOpen}_Abertura TSKs`
        if (!entrada.some(x => x.name === timeOpen)) {
          let objCreated = {
            name: timeOpen,
            details: [element]
          }
          entrada.push(objCreated);
        } else {
          let key = entrada.findIndex(x => x.name == timeOpen)
          entrada[key].details.push(element)
        }
        //console.log("com registro de entrada")
      } else {
        //console.log("Sem registro de entrada")
      }
      if (element.toa_rs_end != "") {
        let timeClosed = element.toa_rs_end.substring(0, 2);
        timeClosed = `${timeClosed}_Fechamento TSKs`
        if (!fechamento.some(x => x.name === timeClosed)) {
          let objCreated = {
            name: timeClosed,
            details: [element]
          }
          fechamento.push(objCreated);
        } else {
          let key = fechamento.findIndex(x => x.name == timeClosed)
          fechamento[key].details.push(element)
        }
      } else {

      }
    });
    entrada.sort((a, b) => {
      if (a.name < b.name) {
        return -1; // a vem antes de b
      }
      if (a.name < b.name) {
        return 1; // a vem depois de b
      }
      return 0; // a e b são iguais
    });

    fechamento.sort((a, b) => {
      if (a.name < b.name) {
        return -1; // a vem antes de b
      }
      if (a.name < b.name) {
        return 1; // a vem depois de b
      }
      return 0; // a e b são iguais
    });

    let xAxis = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    let serieAbertura = [];
    let serieFechamento = [];

    serieAbertura = contarDetalhesPorID(entrada, xAxis);
    serieFechamento = contarDetalhesPorID(fechamento, xAxis);
    let dataUpdate = []
    dataUpdate.push(entrada);
    dataUpdate.push(fechamento)
    let data = [];
    dataUpdate.forEach(element => {
      element.forEach(item => {
        data.push(item)
      });
    });


    let bar = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Abertura TSKs', 'Fechamento TSKs']
      },
      xAxis: {
        type: 'category',
        data: xAxis
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Abertura TSKs',
          type: 'line',
          data: serieAbertura,
          itemStyle: {
            color: '#26e314' // Cor personalizada para 'Entradas'
          }
        },
        {
          name: 'Fechamento TSKs',
          type: 'line',
          data: serieFechamento,
          itemStyle: {
            color: '#f22613' // Cor personalizada para 'Entradas'
          }
        }
      ]
    };

    let read = {}
    read.chart = bar
    read.data = data
    ret.data = read;
    ret.httpStatus = 200;
  } catch (error) {
    ret.data = {};
    ret.errors.push(error.message);
    ret.errorCount = ret.errors.length;
    ret.httpStatus = 400;
  }
  return ret;
}

module.exports = {
  loadingSumaryChartPie,
  loadingDaysChartPie,
  loadingResultsChartBar,
  loadingResultsChartBoss,
  loadingPetrolsChartPie,
  loadingResultsTimeLine,
  loadingResultsTskLine,
  loadingResultsProtLine,
  loadingPetrolChartBoss
};
