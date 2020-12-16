var data;

// var oldDate = null;
// console.logCopy = console.log.bind(console);
// console.log = function(arguments)
// {
//     if (arguments.length)
//     {
//         var d = new Date();
//         if(oldDate==null) timestamp = '';
//         else {
//           var diff = d-oldDate;
//           var msec = diff;
//           var ss = Math.floor(msec / 1000);
//           msec -= ss * 1000;
//           var timestamp = '[' + ss + ':' + msec + '] ';
//         }
//         oldDate = d;
//         this.logCopy(timestamp, arguments);
//     }
// };

const cantons = ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH', 'FL'];
const population = {
  "CH": 8619259,
  "AG": 687491,
  "AI": 16136,
  "AR": 55388,
  "BE": 1040412,
  "BL": 289534,
  "BS": 196386,
  "FR": 322658,
  "GE": 504205,
  "GL": 40713,
  "GR": 198787,
  "JU": 73490,
  "LU": 414364,
  "NE": 176340,
  "NW": 43039,
  "OW": 37906,
  "SG": 511811,
  "SH": 82454,
  "SO": 275661,
  "SZ": 160289,
  "TG": 280068,
  "TI": 350887,
  "UR": 36732,
  "VD": 808652,
  "VS": 345875,
  "ZG": 127387,
  "ZH": 1542594,
  "FL": 38749
};
const names = {
  "CH": "Ganze Schweiz",
  "AG": "Kanton Aargau",
  "AI": "Kanton Appenzell Innerrhoden",
  "AR": "Kanton Appenzell Ausserrhoden",
  "BE": "Kanton Bern",
  "BL": "Kanton Basel Land",
  "BS": "Kanton Basel Stadt",
  "FR": "Kanton Freiburg",
  "GE": "Kanton Genf",
  "GL": "Kanton Glarus",
  "GR": "Kanton Graubünden",
  "JU": "Kanton Jura",
  "LU": "Kanton Luzern",
  "NE": "Kanton Neuenburg",
  "NW": "Kanton Nidwalden",
  "OW": "Kanton Obwalden",
  "SG": "Kanton St. Gallen",
  "SH": "Kanton Schaffhausen",
  "SO": "Kanton Solothurn",
  "SZ": "Kanton Schwyz",
  "TG": "Kanton Thurgau",
  "TI": "Kanton Tessin",
  "UR": "Kanton Uri",
  "VD": "Kanton Waadt",
  "VS": "Kanton Wallis",
  "ZG": "Kanton Zug",
  "ZH": "Kanton Zürich",
  "FL": "Fürstentum Liechtenstein"
};


Chart.defaults.global.defaultFontFamily = "IBM Plex Sans";

document.getElementById("loaded").style.display = 'none';

getBAGMetaData();
//getJSON();

function getBAGMetaData() {
  var url = 'https://www.covid19.admin.ch/api/data/context';
  d3.json(url, function(error, jsondata) {
    var hospURL = jsondata.sources.individual.csv.daily.hospCapacity;
    hospURL = hospURL.replace(".json", ".csv");
    getBAGHospitalData(hospURL);
  });
}

function getBAGHospitalData(url) {
  d3.csv(url, function(error, csvdata) {
      if(error!=null) {
        alert("Daten konnten nicht geladen werden");
      }
      else {
        data = csvdata.filter(d => d.type_variant=="fp7d");
        //alert("Data loaded");
        processData();
      }
  });
}

function processData() {
  // var start = new Date();
  //console.log("Process actual");
  // if(mainData==null) prepareData();
  // var filter = filterAllCH(getDeviceState()==2 ? 2 : 1);


  processActualData(null, null);

  var angularDiv = document.getElementById("interactive");
  var scope = angular.element(angularDiv).scope()
  scope.update();
  scope.$apply();
  // processActualDeaths(filter);
  // processActualHospitalisation(filter);
  // console.log("End actual");
  //getBAGIsolation();
  // console.log("Start All CH");

  // barChartAllCH(filter);
  // console.log("End All CH / Start Deaths");
  // console.log("End Deaths CH / Start Hosp");
  //barChartAllCHHospitalisations();
  // console.log("End Hosp CH");
  //console.log("Start Cantons");
  // for(var i=0; i<cantons.length; i++) {
  //   barChartCases(i);
  // }
  // var angularDiv = document.getElementById("interactive");
  // var scope = angular.element(angularDiv).scope()
  // scope.update();
  // scope.$apply();
  //console.log("End Single Cantons");


  document.getElementById("loadingspinner").style.display = 'none';
  document.getElementById("loaded").style.display = 'block';
}

var total;
var activeMode = "ncumul_conf";
var activeDay = 0; //0 = today; -1 = yesterday; -2 = two days ago;
function processActualData(mode, chosenDay) {
  let latestDay = data[data.length-1].date;
  // if(mode==null) mode = activeMode;
  // if(chosenDay==null) chosenDay = activeDay;
  // if(chosenDay>0) chosenDay = 0;
  // if(mainData.days.length-1+chosenDay<0) chosenDay = -(mainData.days.length-1);
  // activeMode = mode;
  // activeDay = chosenDay;
  // //Highlight chosen Mode
  // var selectedHead = document.getElementById("head_"+mode);
  // selectedHead.classList.add("active");
  // getSiblings(selectedHead, "th.active").forEach(element => element.classList.remove('active'));
  //
  // //Highlight chosen Day
  // var selectedDayHead = document.getElementById("day_"+chosenDay);
  // if(selectedDayHead==null) selectedDayHead = document.getElementById("day_other");
  // else selectedDayHead.classList.add("active");
  // getSiblings(selectedDayHead, "button.active").forEach(element => element.classList.remove('active'));
  //
  // var todaysObject = mainData.days[mainData.days.length-1+chosenDay];
  // var todaysData = todaysObject.data;
  var dateSpan = document.getElementById("dateSpan");
  dateSpan.innerHTML = latestDay;
  //var sortedActual = Array.from(actualData).sort(function(a, b){return b.ncumul_conf-a.ncumul_conf});

  // var timeNow = new Date();
  // timeNow.setMinutes(timeNow.getMinutes()-timeNow.getTimezoneOffset()); //correct offset to UTC
  // timeNow.setHours(timeNow.getHours()-7); //show old date till 7am
  let todaysData = data.filter(d => d.date == latestDay);
  console.log(todaysData);
  let table = document.getElementById("auslastungstable");
  table.innerHTML = "";
  cantons[cantons.length-1] = 'CH';
  for(var i=0; i<cantons.length; i++) {
    let canton = cantons[i];
    let filteredForCanton = todaysData.filter(d => d.geoRegion == canton)[0];
    if(filteredForCanton==null) return;
    //console.log(filteredForCanton);
    var tr = document.createElement("tr");
    var auslastung = 100-filteredForCanton.TotalPercent_FreeCapacity;
    if(!filteredForCanton.ICUPercent_Covid19Patients) filteredForCanton.ICUPercent_Covid19Patients=0;
    if(!filteredForCanton.ICUPercent_AllPatients) filteredForCanton.ICUPercent_AllPatients=0;
    tr.innerHTML = `
      <td><a class='flag ${canton}' href='#detail_${canton}'>${canton}</a></td>
      <td class="total">${filteredForCanton.Total_Covid19Patients}</td>
      <td class="total">${filteredForCanton.TotalPercent_Covid19Patients}</td>
      <td class="total">${filteredForCanton.Total_AllPatients}</td>
      <td class="total">${filteredForCanton.Total_Capacity}</td>
      <td class="total">${filteredForCanton.TotalPercent_AllPatients}</td>
      <td class="icu">${filteredForCanton.ICU_Covid19Patients}</td>
      <td class="icu">${filteredForCanton.ICUPercent_Covid19Patients}</td>
      <td class="icu">${filteredForCanton.ICU_AllPatients}</td>
      <td class="icu">${filteredForCanton.ICU_Capacity}</td>
      <td class="icu">${filteredForCanton.ICUPercent_AllPatients}</td>
    `;

    table.appendChild(tr);
  }
  // var sortedActual = Array.from(todaysData).sort(function(a, b){return b[mode]-a[mode]});

  /*
  var tr = document.createElement("tr");
  var formattedTotal = mainData.days[mainData.days.length-1+chosenDay].total_ncumul_conf.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "’");
  var formatted14DayCases = cases14DaysTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "’");
  var formattedDiff = mainData.days[mainData.days.length-1+chosenDay].diffTotal_ncumul_conf.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "’");
  var incidenceCH = Math.round(cases14DaysTotal / population["CH"] * 100000);
  var riskCH = "low";
  if(incidenceCH>=60) riskCH = "medium";
  if(incidenceCH>=120) riskCH = "high";
  tr.innerHTML = "<td><a class='flag CH' href='#detail_CH'><b>CH</b></a></td><td><b>TOTAL</b></td><td><b>"+formattedTotal+"</b></td><td><b>"+formattedDiff+"</b></td><td><b>"+formatted14DayCases+"</b></td><td><span class=\"newrisk "+riskCH+"\">"+incidenceCH+"</span></td>";
  table.append(tr);
  */

}

function inDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  return false;
}

var app = angular.module('coronach', ['chart.js']);

app.controller('IndexCtrl', ['$scope', function ($scope) {
  $scope.showICU = false;
  $scope.showTotal = true;

  $scope.updateVisibility = function() {
    for (let el of document.querySelectorAll('.icu')) el.style.display = $scope.showICU?'table-cell':'none';
    for (let el of document.querySelectorAll('.total')) el.style.display = $scope.showTotal?'table-cell':'none';
    document.getElementById("titleSpan").innerHTML = $scope.showICU?"Intensivstationen":"Spitalbetten";
  };

}]);


app.controller('ChartCtrl', ['$scope', function ($scope) {

  $scope.labels = [];
  $scope.series = [];
  $scope.data = [];
  $scope.colors = ['#cc0000'];

  $scope.options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            right: 0
        }
    },
    legend: {
      display: false
    },
    title: {
      display: false
    },
    tooltips: {
      mode: 'index',
      intersect: false,
      caretSize: 0,
      bodyFontFamily: 'IBM Plex Mono'
    },
    elements: {
      point: { radius: 0 }
    },
    scales: {
      xAxes: [{
          type: 'time',
          time: {
            tooltipFormat: 'ddd DD.MM.YYYY',
            unit: 'month',
            displayFormats: {
              day: 'DD.MM'
            }
          },
          ticks: {
            unit: 'month'
            // min: getDateForMode(mode),
            // max: new Date(),
          },
          gridLines: {
              color: inDarkMode() ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }
        }],
        yAxes: [{
          type: 'linear',
          position: 'right',
          ticks: {
            beginAtZero: true,
            suggestedMax: 100
          },
          gridLines: {
              color: inDarkMode() ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }
        }]
      },
    plugins: {
      datalabels: {
        display: false
      }
    }
  };
  $scope.datasetOverride = [{
      label: "Auslastung",
      borderColor: '#CCCC00',
      backgroundColor: '#CCCC00',
      fill: false,
      cubicInterpolationMode: 'monotone',
      spanGaps: true
  }];

  //$scope.colors = [ 'white' ];
  $scope.update = function() {
    console.log("Update");
    $scope.data = [];
    $scope.datasetOverride = [];
    var filteredData = data.filter(d => d.geoRegion==="CH");
    console.log(filteredData);
    $scope.labels = filteredData.map(d => {
      var dateSplit = d.date.split("-");
      var day = parseInt(dateSplit[2]);
      var month = parseInt(dateSplit[1])-1;
      var year = parseInt(dateSplit[0]);
      return new Date(year,month,day);
    });
    $scope.datasetOverride = [{
        label: "Auslastung",
        borderColor: '#CC0000',
        backgroundColor: '#CC0000',
        fill: false,
        cubicInterpolationMode: 'monotone',
        spanGaps: true
    }];
    $scope.data = [filteredData.map(d => d.ICUPercent_AllPatients)];
  }

}]);
